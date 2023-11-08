import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(
      `LOGGER_START: ${req.ip} ${req.method} ${req.originalUrl} ${res.statusCode}`,
    );

    res.on('finish', () => {
      this.logger.log(
        `LOGGER_END: ${req.ip} ${req.method} ${req.originalUrl} ${res.statusCode}`,
      );
    });
    next();
  }
}
