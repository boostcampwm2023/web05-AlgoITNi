import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { ResponseMessage } from '../utils';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('HttpException Filter');
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    this.logger.error(
      `path : ${request.url} \n${exception.message}`,
      exception,
    );
    response.status(status).json({
      statusCode: status,
      message:
        status !== HttpStatus.INTERNAL_SERVER_ERROR
          ? exception.message
          : ResponseMessage.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
    });
  }
}

@Catch(JsonWebTokenError)
export class AuthErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger('AuthError Filter');
  catch(exception: JsonWebTokenError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    this.logger.error(
      `path : ${request.url} \n${exception.message}`,
      exception,
    );
    response.status(HttpStatus.UNAUTHORIZED).json({
      statusCode: HttpStatus.UNAUTHORIZED,
      message: ResponseMessage.NEED_LOGIN,
      timestamp: new Date().toISOString(),
    });
  }
}

@Catch()
export class ErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger('Error Filter');
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    this.logger.error(
      `path : ${request.url} \n${exception.message}`,
      exception,
    );
    response.status(status).json({
      statusCode: status,
      message: ResponseMessage.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
    });
  }
}
