import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { returnCode } from '../common/returnCode';
import { RequestCodeBlockDto } from './dto/request-codeblock.dto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { MqService } from '../mq/mq.service';
import { RedisService } from '../redis/redis.service';
import { TimeoutCodeRunning } from '../common/exception/exception';
import { ResponseCodeBlockDto } from './dto/response-codeblock.dto';
import { supportLang } from '../common/supportLang';

@Injectable()
export class RunService {
  private readonly logger = new Logger('RunService');
  constructor(
    private readonly configService: ConfigService,
    private mqService: MqService,
    private redisService: RedisService,
  ) {}
  securityCheck(code: string, language: supportLang): number {
    let patterns;
    switch (language) {
      case 'python':
        patterns = this.pythonCheck();
        break;
      case 'javascript':
        patterns = this.javascriptCheck();
        break;
    }

    for (const pattern of patterns) {
      if (pattern.test(code)) {
        this.logger.warn(`⚠️Invalid Code Requested⚠️\n${code}`);
        return returnCode['vulnerable'];
      }
    }
    return returnCode['safe'];
  }

  async requestRunningApi(
    codeBlock: RequestCodeBlockDto,
  ): Promise<ResponseCodeBlockDto> {
    const url =
      'http://' +
      path.join(this.configService.get<string>('RUNNING_SERVER'), 'codes');

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
      throw new BadRequestException(res.message);
    }
  }

  async requestRunningMQ(
    codeBlock: RequestCodeBlockDto,
  ): Promise<ResponseCodeBlockDto> {
    const job = await this.mqService.addMessage(codeBlock);
    this.logger.log(`added message queue job#${job.id}`);

    // wait for answer
    const result = await this.redisService.getCompletedJob(job.id);
    if (result === null) {
      this.logger.error(`${job.id} failed to find completed job : ${result}`);
      throw new TimeoutCodeRunning();
    }
    this.logger.log(`get completed result ${JSON.stringify(result)}`);
    return result;
  }
  async requestRunningMQPubSub(codeBlock: RequestCodeBlockDto) {
    const job = await this.mqService.addMessage(codeBlock);
    this.logger.log(`added message queue job#${job.id}`);

    return job.id;
  }

  pythonCheck() {
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

    return [...blockModulesPattern, ...inputPattern];
  }

  javascriptCheck() {
    // 모듈 제한
    const blockedModules = [
      'child_process',
      'process',
      'fs',
      'os',
      'path',
      'readline',
    ];
    const blockModulesPattern = [
      new RegExp(
        `(?!["'])require\\s*\\(\\s*["'](${blockedModules.join('|')})`,
        'g',
      ),
    ];

    const blockExpression = [
      new RegExp(`(?!["'])process\\.(.*)`, 'y'),
      new RegExp(`(?!["'])\\s*__dirname\\s*(?!["'])`, 'y'),
    ];

    return [...blockModulesPattern, ...blockExpression];
  }
}
