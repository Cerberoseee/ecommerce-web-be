import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { AppException, ErrorResponseDto } from '../base/base.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(HttpExceptionFilter.name);
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const data = exception.getResponse();
    const error = new AppException(null, 'http-exception', status);
    if (typeof data === 'string') {
      error.message = data;
    } else if (data.hasOwnProperty('message')) {
      error.message = data['message'];
    } else if (error.message.includes(`${process.env.DB_HOST}`)) {
      error.message = 'Internal server error. Please try again later';
    } else {
      error.message =
        'exception that occurred during the processing of HTTP requests';
      error.data = data;
    }
    this.logger.error(exception.message, { ...exception });
    response.status(error.statusCode).json(new ErrorResponseDto(error));
  }
}
