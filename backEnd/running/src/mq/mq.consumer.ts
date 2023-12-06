import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { RedisService } from '../redis/redis.service';
import { HttpStatus, Logger } from '@nestjs/common';
import { CodesService } from '../codes/codes.service';
import { ResponseCodeDto } from '../codes/dto/response-code.dto ';
import { ResponseCodeBlockDto } from './dto/response-codeblock.dto';
import * as process from 'process';
import { REDIS } from '../common/utils';
@Processor('runningRequest')
export class MqConsumer {
  private logger = new Logger(MqConsumer.name);
  private errorMessage = {
    400: 'Failed to Run Code',
    201: 'Running Code Success',
  };
  constructor(
    private redisService: RedisService,
    private codesService: CodesService,
  ) {}
  @Process(REDIS.QUEUE)
  async getMessageQueue(job: Job) {
    this.logger.debug(`getMessageQueue ${job.id}, ${job.data.code}`);
    let result: ResponseCodeDto | string;
    const res = new ResponseCodeBlockDto();

    try {
      result = await this.codesService.runCode(job.data);
      const output: string =
        typeof result === 'string' ? result : result.output;

      res.statusCode = HttpStatus.CREATED;
      res.result = output;
      res.message = this.errorMessage[HttpStatus.CREATED];
    } catch (e) {
      if (e.status !== HttpStatus.BAD_REQUEST) {
        this.logger.error(e);
        res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        res.message = 'Internal Server Error';
      } else {
        res.statusCode = e.status;
        res.result = e.message;
        res.message = this.errorMessage[e.status];
      }
    } finally {
      this.logger.log(`${job.id} complete`);

      const mode = process.env.MODE || 'V3';
      if (mode !== 'V3') {
        return this.redisService.addCompletedJob(job.id, res);
      }
      return this.redisService.publish(job.id, res);
    }
  }
}
