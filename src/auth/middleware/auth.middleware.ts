import { Injectable, NestMiddleware } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Request, Response } from 'express';

/**
 * Interface for all In-App-Requests
 */
export interface TrackingRequest extends Request {
  /** User-ID */
  userId: number;
  /** Token */
  jwtToken: string;
  /** Role */
  userRole: Role;
}

/**
 * Middleware to prepare request and verify user
 * @see https://docs.nestjs.com/middleware
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  /** Key of the JWT-Token in http header */
  static readonly TOKEN_KEY = 'JWT'; // TODO

  /**
   * Prepares request and verify token
   */
  use(req: TrackingRequest, res: Response, next: () => void): void {
    const jwtToken: string = req.get(AuthMiddleware.TOKEN_KEY);
    // console.log(req);
    // const tokenData = service.verify(); TODO verify Token
    req.jwtToken = '123-456'; // TODO tokenData.token;
    req.userId = 1; // TODO tokenData.userId;
    req.userRole = Role.ADMIN; // TODO

    next();
  }
}
