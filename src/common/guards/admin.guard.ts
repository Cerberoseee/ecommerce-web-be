import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { verifyJwtToken } from '../../helpers/jwt.helper';
import { UserRole } from 'src/modules/users/users.enum';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    if (!request.headers.authorization) {
      return false;
    }
    const [scheme, token] = request.headers.authorization.split(' ');
    if (scheme !== 'Bearer') {
      return false;
    }
    const [isValid, user] = verifyJwtToken(token);
    if (!isValid) return false;
    if (!user.role || (user.role && user.role !== UserRole.ADMIN)) return false;
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
