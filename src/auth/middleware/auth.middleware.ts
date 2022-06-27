import { Injectable, NestMiddleware } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Request, Response } from 'express';
import { ExtractJwt } from 'passport-jwt';
import { AuthService } from '../auth.service';

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
  constructor(private authService: AuthService) {}

  /**
   * Prepares request and verify token
   */
  use(req: TrackingRequest, res: Response, next: () => void): void {
    const extractJwtFunc = ExtractJwt.fromAuthHeaderAsBearerToken();
    const jwtToken: string = extractJwtFunc(req);
    const data = this.authService.verifyToken(jwtToken);
    req.jwtToken = jwtToken;
    req.userId = data.sub;
    req.userRole = Role[data.role];

    next();
  }
}
