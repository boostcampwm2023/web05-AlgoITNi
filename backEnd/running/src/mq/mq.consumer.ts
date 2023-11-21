import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { RedisService } from '../redis/redis.service';
import { HttpStatus, Logger } from '@nestjs/common';
import { CodesService } from '../codes/codes.service';
import { ResponseCodeDto } from '../codes/dto/response-code.dto ';
import { ResponseCodeBlockDto } from './dto/response-codeblock.dto';
@Processor('runningRequest')
export class MqConsumer {
  private logger = new Logger(MqConsumer.name);
  private errorMessage = {
    400: 'Failed to Run Code',
    201: 'Running Python Code Success',
  };
  constructor(
    private redisService: RedisService,
    private codesService: CodesService,
  ) {}
  @Process('task')
  async getMessageQueue(job: Job) {
    this.logger.debug(`getMessageQueue ${job.id}, ${job.data}`);
    let result: ResponseCodeDto | string;
    const responseCodeBlockDTO = new ResponseCodeBlockDto();
    try {
      result = await this.codesService.testCode(job.data);
      const output: string | string[] =
        typeof result === 'string' ? result : result.output;
      this.logger.debug(JSON.stringify(result));

      responseCodeBlockDTO.statusCode = HttpStatus.CREATED;
      responseCodeBlockDTO.result = output;
      responseCodeBlockDTO.message = this.errorMessage[HttpStatus.CREATED];
    } catch (e) {
      console.log(e);
      responseCodeBlockDTO.statusCode = e.status;
      if (e.status === HttpStatus.INTERNAL_SERVER_ERROR) {
        responseCodeBlockDTO.message = e.message;
      } else {
        responseCodeBlockDTO.result = e.message;
        responseCodeBlockDTO.message = this.errorMessage[e.status];
      }
    } finally {
      this.logger.log(`${job.id} complete`);
      return this.redisService.addCompletedJob(job.id, responseCodeBlockDTO);
    }
  }
}