import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { returnCode } from '../common/returnCode';
import { RequestCodeblockDto } from './dto/request-codeblock.dto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { requestPath } from '../common/utils';
import * as path from 'path';
import { MqService } from '../mq/mq.service';
import { RedisService } from '../redis/redis.service';
import { TimeoutCodeRunning } from '../common/exception/exception';
import { ResponseCodeBlockDto } from './dto/response-codeblock.dto';
import { supportLang } from '../common/type';

@Injectable()
export class RunService {
  private readonly logger = new Logger('RunService');

  constructor(
    private readonly configService: ConfigService,
    private mqService: MqService,
    private redisService: RedisService,
  ) {}
  securityCheck(code: string, language: supportLang): number {
    switch (language) {
      case 'python':
        return this.pythonCheck(code);
      case 'javascript':
        return this.javascriptCheck(code);
    }
  }

  pythonCheck(code: string) {
    // 모듈 제한
    const blockedModules = [
      'os',
      'sys',
      'shutil',
      'subprocess',
      'threading',
      'multiprocessing',
    ];
    const blockModulesPattern = [
      new RegExp(
        `(?!["'])import\\s+(${blockedModules.join('|')})\\s*(?!["'])`,
        'g',
      ),
      new RegExp(`from\\s+(${blockedModules.join('|')})\\s*`, 'g'),
    ];

    // 사용자 함수 사용 제한
    const blockedFunctions = ['input', 'open'];
    const inputPattern = [
      new RegExp(`\(${blockedFunctions.join('|')}) *\\(`, 'g'),
      new RegExp(`(\\w+) *= *(${blockedFunctions.join('|')}) *`, 'g'),
    ];

    // check
    for (const pattern of [...blockModulesPattern, ...inputPattern]) {
      if (pattern.test(code)) {
        this.logger.warn(`⚠️Invalid Code Requested⚠️\n${code}`);
        return returnCode['vulnerable'];
      }
    }

    return returnCode['safe'];
  }

  javascriptCheck(code: string) {
    return returnCode['vulnerable'];
  }

  async requestRunningApi(
    codeBlock: RequestCodeblockDto,
  ): Promise<ResponseCodeBlockDto> {
    const url =
      'http://' +
      path.join(
        this.configService.get<string>('RUNNING_SERVER'),
        requestPath[codeBlock.language],
      );
    try {
      const result = await axios.post(url, codeBlock);
      return new ResponseCodeBlockDto(
        result.status,
        result.data.output,
        'Running Code Success',
      );
    } catch (e) {
      this.logger.error(e.message);
      const res = e.response.data;
      if (e.response.data.status === HttpStatus.INTERNAL_SERVER_ERROR)
        throw new InternalServerErrorException();
      return new ResponseCodeBlockDto(
        res.statusCode,
        res.message,
        'Failed to Run Code',
      );
    }
  }

  async requestRunningMQ(
    codeBlock: RequestCodeblockDto,
  ): Promise<ResponseCodeBlockDto> {
    const job = await this.mqService.addMessage(codeBlock);
    this.logger.log(`added message queue job#${job.id}`);

    // wait for answer
    const result = await this.redisService.getCompletedJob(job.id);
    if (result === null) {
      this.logger.error(`${job.id} failed to find completed job : ${result}`);
      throw new TimeoutCodeRunning();
    }
    this.logger.log(`get completed result ${result}`);
    return result;
  }
  async requestRunningMQPubSub(
    codeBlock: RequestCodeblockDto,
    socketID: string,
  ): Promise<void> {
    const job = await this.mqService.addMessage(codeBlock);
    this.logger.log(`added message queue job#${job.id}`);

    // start subscribe
    this.mqService.setInfo(job.id, socketID);
  }
}
