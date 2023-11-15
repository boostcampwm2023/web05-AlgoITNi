import { Body, Controller, HttpCode, Post, Get } from '@nestjs/common';
import { RunService } from './run.service';
import { RequestCodeblockDto } from './dto/request-codeblock.dto';
import { returnCode } from '../common/returnCode';
import { VulnerableException } from '../common/exception/exception';
import { ResponseCodeBlockDto } from './dto/response-codeblock.dto';
import { MqService } from '../mq/mq.service';

@Controller('run')
export class RunController {
  data = 0;
  constructor(
    private mqService: MqService,
    private readonly runService: RunService,
  ) {}
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

  @Get('queue')
  async push() {
    const job = await this.mqService.addMessage(this.data++);
    console.log('queue create ', job.id);
    return this.data;
  }
}
