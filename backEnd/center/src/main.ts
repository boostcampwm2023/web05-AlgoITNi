import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ErrorFilter } from './common/exception/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalFilters(new ErrorFilter());

  app.enableCors({
    origin: true,
    credentials: true,
  });

  const port = configService.get<number>('PORT');
  await app.listen(port);
}
bootstrap();
