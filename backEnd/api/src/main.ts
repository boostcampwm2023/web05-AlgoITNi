import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TimeoutInterceptor } from './common/interceptor/timeout.intercetor';
import { ConfigService } from '@nestjs/config';
import { ErrorFilter } from './common/exception/exception.filter';
import { ValidationPipe } from '@nestjs/common'
import { WinstonLogger } from './common/logger/winstonLogger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalInterceptors(new TimeoutInterceptor(configService));
  app.useGlobalFilters(new ErrorFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  const origin = configService.get<string>('ALLOWED_ORIGIN');
  app.useLogger(app.get(WinstonLogger));

  app.enableCors({
    origin: true,
    credentials: true,
  });

  const port = configService.get<number>('PORT');
  await app.listen(port);
}
bootstrap();
