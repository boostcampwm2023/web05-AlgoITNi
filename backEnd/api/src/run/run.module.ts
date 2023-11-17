import { Module } from '@nestjs/common';
import { RunController } from './run.controller';
import { RunService } from './run.service';
import { MqModule } from '../mq/mq.module';
import {RedisModule} from "../redis/redis.module";

@Module({
  imports: [MqModule, RedisModule],
  controllers: [RunController],
  providers: [RunService],
})
export class RunModule {}
