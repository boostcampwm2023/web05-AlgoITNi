import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { TimeoutInterceptor } from './interceptor/timeout.intercetor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalInterceptors(new TimeoutInterceptor(configService));
  await app.listen(3000);
}
bootstrap();
