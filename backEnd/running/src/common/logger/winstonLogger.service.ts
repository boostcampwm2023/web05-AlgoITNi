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
  constructor(private configService: ConfigService) {
    const logDir = (() => {
      const __dirname = path.resolve();
      return path.join(__dirname, 'logs');
    })();

    const dailyOptions = {
      filename: '%DATE%.log',
      datePattern: 'YYYY-MM-DD-HH',
      dirname: logDir,
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '7d',
    };
    const transport: winston.transport[] = [new winstonDaily(dailyOptions)];
    if (this.configService.get<string>('NODE_ENV') !== 'production') {
      const devConsole = new winston.transports.Console({
        format: combine(
          colorize(),
          utilities.format.nestLike('api Server', {
            prettyPrint: true,
          }),
        ),
      });

      transport.push(devConsole);
    }

    const logFormat = printf(
      ({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`,
    );

    this.logger = WinstonModule.createLogger({
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        logFormat,
      ),
      level:
        this.configService.get<string>('NODE_ENV') !== 'production'
          ? 'silly'
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
