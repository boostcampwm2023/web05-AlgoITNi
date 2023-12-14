import { Module } from '@nestjs/common';
import { RunController } from './run.controller';
import { RunService } from './run.service';
import { MqModule } from '../mq/mq.module';
import { RedisModule } from '../redis/redis.module';
import { RunGateway } from './run.gateway';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [MqModule, RedisModule, ScheduleModule.forRoot()],
  controllers: [RunController],
  providers: [RunService, RunGateway],
})
export class RunModule {}
