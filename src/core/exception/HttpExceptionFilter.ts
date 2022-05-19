import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpStatus,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime';

/**
 * Global Exception Filter
 * @see https://docs.nestjs.com/exception-filters
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    if (httpAdapter) {
      const ctx = host.switchToHttp();

      const handleError: ErrorPayload = this.handleError(exception);
      const httpStatus = handleError ? handleError.status : HttpStatus.BAD_REQUEST;
      const message = handleError ? handleError.message : 'server error';

      let stack: string = '';
      if (exception && exception instanceof BadRequestException) {
        stack += exception.message + '\n' + exception.stack + '\n';

        const response = exception['response'] || null;
        if (response?.message) {
          stack += response.message?.length ? (response.message as string[]).join('\n') : response.message;
        }
      }

      Logger.error(
        `${handleError ? 'Handled Error' : 'Unhandled Error'} (Status: ${httpStatus}): ${message}\n${
          stack != '' ? stack : exception
        }`,
      );

      const responseBody = {
        statusCode: httpStatus,
        timestamp: new Date().toISOString(),
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
        message,
      };

      httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    } else {
      Logger.error(`Error can not be handled:\n${exception ? exception.toString() : ''}`);
    }
  }

  /**
   * Try to handle error
   */
  private handleError(exception: unknown): ErrorPayload {
    if (exception instanceof ForbiddenException || exception instanceof UnauthorizedException) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        message: 'forbidden operation',
      };
    }

    // Database errors
    if (exception instanceof PrismaClientKnownRequestError) {
      if (exception.code === 'P2001') {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'entity not found',
        };
      }

      if (exception.code === 'P2002') {
        return {
          status: HttpStatus.CONFLICT,
          message: 'already exists',
        };
      }

      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'database error',
      };
    }

    if (exception instanceof PrismaClientValidationError || exception instanceof PrismaClientUnknownRequestError) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'database error',
      };
    }

    return null;
  }
}

/**
 * Interface for error response
 */
interface ErrorPayload {
  /** HTTP-Status-Code */
  status: number;
  /** Error message */
  message: string;
}
