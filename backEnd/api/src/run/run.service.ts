import { Injectable, Logger } from '@nestjs/common';
import { returnCode } from '../common/returnCode';
import { RequestCodeblockDto } from './dto/request-codeblock.dto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { requestPath } from '../common/utils';
import * as path from 'path';

@Injectable()
export class RunService {
  private readonly logger = new Logger('RunService');

  constructor(private readonly configService: ConfigService) {}
  securityCheck(data) {
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
      if (pattern.test(data)) {
        this.logger.warn(`⚠️Invalid Code Requested⚠️\n${data}`);
        return returnCode['vulnerable'];
      }
    }

    return returnCode['safe'];
  }

  async requestRunning(codeBlock: RequestCodeblockDto) {
    const result = await axios.post(
      'http://' +
        path.join(
          this.configService.get<string>('RUNNING_SERVER'),
          requestPath.RUN_PYTHON,
        ),
      codeBlock,
    );
    return result.data;
  }
}
