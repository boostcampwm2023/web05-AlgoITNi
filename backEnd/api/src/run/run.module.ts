import { Module } from '@nestjs/common';
import { RunController } from './run.controller';
import { RunService } from './run.service';
import { MqModule } from '../mq/mq.module';

@Module({
  imports: [MqModule],
  controllers: [RunController],
  providers: [RunService],
})
export class RunModule {}
