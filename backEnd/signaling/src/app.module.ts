import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WebRtcGateway } from './webRTC/web-rtc.gateway';
import { WinstonLogger } from './common/logger/winstonLogger.service';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        readyLog: true,
        config: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          password: configService.get<string>('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService, WebRtcGateway, WinstonLogger],
})
export class AppModule {}
