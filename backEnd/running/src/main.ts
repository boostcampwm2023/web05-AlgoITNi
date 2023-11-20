import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ErrorFilter } from './common/exception/exception.filter';
import { WinstonLogger } from './common/logger/winstonLogger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalFilters(new ErrorFilter());

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
