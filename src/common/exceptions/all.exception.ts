import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { AppException, ErrorResponseDto } from '../base/base.dto';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor() {}
  catch(
    exception: Error & {
      response?: any;
      statusCode?: number;
      code?: string;
      data?: any;
      status?: number;
    },
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    if (exception?.name === 'AxiosError') {
      const { response: axiosRes } = exception;
      return response
        .status(axiosRes?.status || 500)
        .json(axiosRes?.data || {});
    }
    if (
      exception?.message &&
      exception?.message?.includes(`${process.env.DB_HOST}`)
    ) {
      exception.message = 'Internal server error. Please try again later';
    }
    console.error(exception);
    response
      .status(
        exception?.['statusCode']
          ? exception['statusCode']
          : exception?.['status']
          ? exception['status']
          : 500,
      )
      .json(
        new ErrorResponseDto(
          new AppException(
            exception?.message ||
              'Internal server error. Please try again later',
            exception?.['code'],
            exception?.['statusCode'],
            exception?.['data'],
          ),
        ),
      );
  }
}
