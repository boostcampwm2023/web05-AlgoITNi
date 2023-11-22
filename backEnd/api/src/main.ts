import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TimeoutInterceptor } from './common/interceptor/timeout.intercetor';
import { ConfigService } from '@nestjs/config';
import {
  HttpExceptionFilter,
  AuthErrorFilter,
  ErrorFilter,
} from './common/exception/exception.filter';
import { WinstonLogger } from './common/logger/winstonLogger.service';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalInterceptors(new TimeoutInterceptor(configService));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.useGlobalFilters(
    new ErrorFilter(),
    new HttpExceptionFilter(),
    new AuthErrorFilter(),
  );

  // const origin = configService.get<string>('ALLOWED_ORIGIN');
  app.useLogger(app.get(WinstonLogger));

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.use(cookieParser());
  app.use(
    session({
      secret: configService.get<string>('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
    }),
  );
  const port = configService.get<number>('PORT');
  await app.listen(port);
}
bootstrap();
