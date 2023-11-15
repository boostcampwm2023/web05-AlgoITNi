import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import {RedisService} from "../redis/redis.service";
import {Logger} from "@nestjs/common";
@Processor('runningRequest')
export class MqConsumer {
  private logger = new Logger(MqConsumer.name)
  constructor(private redisService: RedisService) {
  }
  @Process('task')
  getMessageQueue(job: Job) {
    this.redisService.addCompletedJob(job.id, job.data);
    this.logger.log(`${job.id} complete`);
  }
}
