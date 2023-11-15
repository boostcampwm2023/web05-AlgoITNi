import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { RedisService } from '../redis/redis.service';
import { Logger } from '@nestjs/common';
import { CodesService } from '../codes/codes.service';
import { ResponseCodeDto } from '../codes/dto/response-code.dto ';
@Processor('runningRequest')
export class MqConsumer {
  private logger = new Logger(MqConsumer.name);
  constructor(
    private redisService: RedisService,
    private codesService: CodesService,
  ) {}
  @Process('task')
  async getMessageQueue(job: Job) {
    this.logger.debug(`getMessageQueue ${job.id}, ${job.data}`);
    const result: ResponseCodeDto | string = await this.codesService.testCode(
      job.data,
      false,
    );
    this.logger.debug(result);

    const output: string[] =
      typeof result === 'string' ? [result] : result.output;

    this.redisService.addCompletedJob(job.id, output);
    this.logger.log(`${job.id} complete`);
  }
}
