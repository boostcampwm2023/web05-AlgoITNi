import { utilities, WinstonModule } from 'nest-winston';
import * as winstonDaily from 'winston-daily-rotate-file';
import * as winston from 'winston';
import * as path from 'path';

const { combine, timestamp, printf, colorize } = winston.format;
import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WinstonLogger implements LoggerService {
  private logger: LoggerService;
  private readonly logDir = (() => {
    const __dirname = path.resolve();
    return path.join(__dirname, 'logs');
  })();
  constructor(private configService: ConfigService) {
    const transport = this.getTransport();
    this.logger = this.createLogger(transport);
  }

  getTransport(): winston.transport[] {
    const transport: winston.transport[] = [
      new winstonDaily({
        filename: '%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        dirname: this.logDir,
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '7d',
      }),
      new winstonDaily({
        filename: '%DATE%.error.log',
        datePattern: 'YYYY-MM-DD-HH',
        dirname: this.logDir + '/error',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '7d',
        level: 'error',
      }),
    ];

    if (this.configService.get<string>('NODE_ENV') !== 'production') {
      const devConsole = new winston.transports.Console({
        format: combine(
          colorize(),
          utilities.format.nestLike('API Server', {
            prettyPrint: true,
          }),
        ),
      });

      transport.push(devConsole);
    }
    return transport;
  }

  createLogger(transport: winston.transport[]) {
    const logFormat = printf(
      ({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`,
    );
    return WinstonModule.createLogger({
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        logFormat,
      ),
      level:
        this.configService.get<string>('NODE_ENV') !== 'production'
          ? 'debug'
          : 'info',
      transports: transport,
    });
  }

  log(message: string, ...optionalParams: any[]) {
    this.logger.log(message, ...optionalParams);
  }

  error(message: string, ...optionalParams: any[]) {
    this.logger.error(message, ...optionalParams);
  }

  warn(message: string, ...optionalParams: any[]) {
    this.logger.warn(message, ...optionalParams);
  }
  debug(message: string, ...optionalParams: any[]) {
    return this.logger.debug(message, ...optionalParams);
  }
  verbose(message: string, ...optionalParams: any[]) {
    this.logger.verbose(message, ...optionalParams);
  }
}
