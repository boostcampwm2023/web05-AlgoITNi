import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { TimeoutInterceptor } from './common/interceptor/timeout.intercetor';
import {ErrorFilter} from "./common/exception/exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalInterceptors(new TimeoutInterceptor(configService));
  app.useGlobalFilters(new ErrorFilter());

  const port = configService.get<number>('PORT');
  await app.listen(port);
}
bootstrap();
