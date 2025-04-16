import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { verifyJwtToken } from '../../helpers/jwt.helper';
import { Reflector } from '@nestjs/core';
import * as express from 'express';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User {
      id?: string;
      full_name?: string;
      email?: string;
      username?: string;
      exp?: number;
      admin_workspace?: string[];
    }
    interface Customer {
      id: string;
      name?: string;
      email?: string;
      workspace_id: string;
    }
    export interface Request {
      user?: User;
      guestCustomer?: Customer;
      email?: string;
      agent_id?: string;
    }
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
  ) {
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    return this.validateRequest(request);
  }

  async validateRequest(
    request: express.Request,
  ) {
    if (!request.headers.authorization) {
      return false;
    }
    const [scheme, token] = request.headers.authorization.split(' ');
    if (scheme !== 'Bearer') {
      return false;
    }
    const [isValid, user] = verifyJwtToken(token);
    if (!isValid) return false;
    if (user.exp) {
      const today = new Date();
      const expiresAt = new Date(user.exp * 1000);
      if (today > expiresAt) {
        throw new ForbiddenException('Token expired');
      }
    }
    request.user = { ...request.user, ...user };
    return true;
  }
}
