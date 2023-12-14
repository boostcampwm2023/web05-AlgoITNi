import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { RequestCodeBlockDto } from '../run/dto/request-codeblock.dto';
import { REDIS } from '../common/utils';

@Injectable()
export class MqService {
  private logger = new Logger(MqService.name);
  constructor(@InjectQueue('runningRequest') private queue: Queue) {}

  async addMessage(data: RequestCodeBlockDto) {
    const job = await this.queue.add(REDIS.QUEUE, data, {
      removeOnComplete: true,
    });
    this.logger.log(`push to task Queue ${job.id}`);
    return job;
  }
}
