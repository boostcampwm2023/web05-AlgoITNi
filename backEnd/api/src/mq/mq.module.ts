import { Module } from '@nestjs/common';
import { MqConsumer } from './mq.consumer';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MqService } from './mq.service';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('QUEUE_HOST'),
          port: configService.get<number>('QUEUE_PORT'),
          password: configService.get<string>('QUEUE_PASSWORD'),
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'runningRequest',
    }),
  ],
  providers: [MqConsumer, MqService],
  exports: [MqService],
})
export class MqModule {}
