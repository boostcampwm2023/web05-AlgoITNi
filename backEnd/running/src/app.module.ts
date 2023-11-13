import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TimeoutInterceptor } from './common/interceptor/timeout.intercetor';
import { LoggerMiddleware } from './common/logger/logger.middleware';
import { SlackModule } from 'nestjs-slack-webhook';
import { WinstonLogger } from './common/logger/winstonLogger.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SlackModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          type: 'webhook',
          url: configService.get<string>('WEB_HOOK_URL'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, TimeoutInterceptor, WinstonLogger],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
