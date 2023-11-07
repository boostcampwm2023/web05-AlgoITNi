import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(private configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();

    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap(() => {
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime > 0) {
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
