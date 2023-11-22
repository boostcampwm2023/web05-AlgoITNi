import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './common/logger/logger.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TimeoutInterceptor } from './common/interceptor/timeout.intercetor';
import { SlackModule } from 'nestjs-slack-webhook';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RunModule } from './run/run.module';
import { UsersModule } from './users/users.module';
import { WinstonLogger } from './common/logger/winstonLogger.service';
import { MqModule } from './mq/mq.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { CrawlerModule } from './crawler/crawler.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database:
          configService.get<string>('NODE_ENV') === 'dev'
            ? configService.get<string>('DEV_DB_DATABASE')
            : configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/**/entity/*.entity{.ts,.js}'],
        synchronize: configService.get<string>('SYNCHRONIZED') === 'true',
        logging: ['query', 'error'],
      }),
    }),
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
    RunModule,
    UsersModule,
    MqModule,
    RedisModule,
    AuthModule,
    CrawlerModule,
  ],
  controllers: [AppController],
  providers: [AppService, TimeoutInterceptor, WinstonLogger],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
