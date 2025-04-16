import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs';
import { Request } from 'express';

export interface ResponseType<T> {
  success: boolean;
  data: T | { message: string };
}

export class ResponseInterceptor<T>
  implements NestInterceptor<T, ResponseType<T>>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseType<T>> {
    const url = _context.switchToHttp().getRequest<Request>()?.url;
    return next.handle().pipe(
      map((data: T): ResponseType<T> | any => {
        if (url === '/api/metrics') {
          return data;
        }
        return {
          success: true,
          data,
        };
      }),
      catchError((error) => {
        throw error;
      }),
    );
  }
}
