import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { RunService } from './run.service';
import { RequestCodeblockDto } from './dto/request-codeblock.dto';
import { returnCode } from '../common/returnCode';
import { VulnerableException } from '../common/exception/exception';
import { ResponseCodeBlockDto } from './dto/response-codeblock.dto';
@Controller('run')
export class RunController {
  constructor(private readonly runService: RunService) {}
  @HttpCode(200)
  @Post()
  async requestRunCode(@Body() codeBlock: RequestCodeblockDto) {
    const { code } = codeBlock;
    const securityCheck = this.runService.securityCheck(code);
    if (securityCheck === returnCode['vulnerable']) {
      // fail
      throw new VulnerableException();
    }

    const result = await this.runService.requestRunning(codeBlock);
    const responseCodeBlockDto = new ResponseCodeBlockDto(
      200,
      result.result,
      'Running Python Code Success',
    );
    return responseCodeBlockDto;
  }
}
