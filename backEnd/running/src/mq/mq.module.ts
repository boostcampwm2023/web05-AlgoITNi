import { Module } from '@nestjs/common';
import { MqConsumer } from './mq.consumer';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '../redis/redis.module';
import { CodesModule } from '../codes/codes.module';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          password: configService.get<string>('REDIS_PASSWORD'),
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'runningRequest',
    }),
    RedisModule,
    CodesModule,
  ],
  providers: [MqConsumer],
  exports: [MqConsumer],
})
export class MqModule {}
