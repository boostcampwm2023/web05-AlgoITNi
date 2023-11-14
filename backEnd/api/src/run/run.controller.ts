import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { RunService } from './run.service';
import { GetCodeBlockDto } from './dto/get-codeblock.dto';
import { returnCode } from '../common/returnCode';
import { VulnerableException } from '../common/exception/exception';

@Controller('run')
export class RunController {
  constructor(private readonly runService: RunService) {}
  @HttpCode(200)
  @Post()
  requestRunCode(@Body() codeBlock: GetCodeBlockDto) {
    const { data } = codeBlock;
    const result = this.runService.securityCheck(data);
    if (result === returnCode['vulnerable']) {
      // fail
      throw new VulnerableException();
    }
    return { result: 'success' };
  }
}
