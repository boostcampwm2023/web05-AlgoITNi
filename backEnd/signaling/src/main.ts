import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { WinstonLogger } from './common/logger/winstonLogger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useWebSocketAdapter(new IoAdapter(app));
  app.useLogger(app.get(WinstonLogger));

  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT');
  const origin = configService.get<string>('ALLOWED_ORIGIN');

  app.enableCors({
    origin: origin,
    credentials: true,
  });
  await app.listen(port);
}
bootstrap();
