import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, throwError, timeout } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Request } from 'express';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(private configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();

    const request = context.switchToHttp().getRequest();
    const timeoutValue = this.configService.get<number>('TIMEOUT') | 5000;

    return next.handle().pipe(
      timeout(timeoutValue),
      catchError((error) => {
        if (error.name === 'TimeoutError') {
          return throwError(() => new RequestTimeoutException());
        } else {
          return throwError(() => error);
        }
      }),
      tap(() => {
        const elapsedTime = Date.now() - startTime;
        if (this.configService.get<string>('NODE_ENV') !== 'dev') {
          this.timeOutNotification(elapsedTime, request);
        }
      }),
    );
  }

  async timeOutNotification(elapsedTime: number, req: Request) {
    const url = this.configService.get<string>('WEB_HOOK_URL');
    await axios.post(url, {
      text: `ip: ${req.ip}\n method: ${req.method}\n url: ${req.originalUrl}\n elapsedTime: ${elapsedTime}mm`,
    });
  }
}
