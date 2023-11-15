import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MqService {
  private logger = new Logger(MqService.name);
  constructor(
    @InjectQueue('runningRequest') private testQueue: Queue,
    private configService: ConfigService,
  ) {}

  async addMessage(data) {
    const job = await this.testQueue.add(
      'task',
      { data },
      { removeOnComplete: true },
    );
    this.logger.log(`push to task Queue ${job.id}`);
    return job;
  }
}
