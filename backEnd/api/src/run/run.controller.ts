import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { RunService } from './run.service';
import { RequestCodeBlockDto } from './dto/request-codeblock.dto';
import { returnCode } from '../common/returnCode';
import { VulnerableException } from '../common/exception/exception';
import { MqService } from '../mq/mq.service';
import { RedisService } from '../redis/redis.service';
import { RequestRunPipe } from './pipes/saveCode.pipe';

@Controller('run')
export class RunController {
  data = 0;
  constructor(
    private mqService: MqService,
    private readonly runService: RunService,
    private redisService: RedisService,
  ) {}
  @HttpCode(200)
  @Post('v1')
  async requestRunCode(@Body(RequestRunPipe) codeBlock: RequestCodeBlockDto) {
    this.securityCheck(codeBlock);
    const responseCodeBlockDto =
      await this.runService.requestRunningApi(codeBlock);
    return responseCodeBlockDto;
  }

  @HttpCode(200)
  @Post('v2')
  async requestRunCodeV2(@Body(RequestRunPipe) codeBlock: RequestCodeBlockDto) {
    this.securityCheck(codeBlock);

    const responseCodeBlockDto =
      await this.runService.requestRunningMQ(codeBlock);

    return responseCodeBlockDto;
  }

  @HttpCode(202)
  @Post('v3')
  async requestRunCodeV3(
    @Query('id') socketID: string,
    @Body(RequestRunPipe) codeBlock: RequestCodeBlockDto,
  ): Promise<void> {
    this.securityCheck(codeBlock);

    await this.runService.requestRunningMQPubSub(codeBlock, socketID);
  }

  securityCheck(codeBlock: RequestCodeBlockDto) {
    const { code, language } = codeBlock;
    const securityCheck = this.runService.securityCheck(code, language);

    if (securityCheck === returnCode['vulnerable']) {
      // fail
      throw new VulnerableException();
    }
  }

  @Get('avgTime')
  showAvgTrialTime() {
    return this.redisService.showTrialTimeAvg();
  }
}
