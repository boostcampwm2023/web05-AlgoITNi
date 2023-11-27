import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { RunService } from './run.service';
import { RequestCodeblockDto } from './dto/request-codeblock.dto';
import { returnCode } from '../common/returnCode';
import { VulnerableException } from '../common/exception/exception';
import { MqService } from '../mq/mq.service';
import { RedisService } from '../redis/redis.service';

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
  async requestRunCode(@Body() codeBlock: RequestCodeblockDto) {
    const { code } = codeBlock;
    const securityCheck = this.runService.securityCheck(code);
    if (securityCheck === returnCode['vulnerable']) {
      // fail
      throw new VulnerableException();
    }

    const responseCodeBlockDto =
      await this.runService.requestRunningApi(codeBlock);
    return responseCodeBlockDto;
  }

  @HttpCode(200)
  @Post('v2')
  async requestRunCodeV2(@Body() codeBlock: RequestCodeblockDto) {
    const { code } = codeBlock;
    const securityCheck = this.runService.securityCheck(code);
    if (securityCheck === returnCode['vulnerable']) {
      // fail
      throw new VulnerableException();
    }

    const responseCodeBlockDto =
      await this.runService.requestRunningMQ(codeBlock);

    return responseCodeBlockDto;
  }

  @Get('avgTime')
  showAvgTrialTime() {
    return this.redisService.showTrialTimeAvg();
  }

  @HttpCode(202)
  @Post('v3')
  async requestRunCodeV3(
    @Query('id') socketID: string,
    @Body() codeBlock: RequestCodeblockDto,
  ): Promise<void> {
    const { code } = codeBlock;
    const securityCheck = this.runService.securityCheck(code);
    if (securityCheck === returnCode['vulnerable']) {
      // fail
      throw new VulnerableException();
    }

    await this.runService.requestRunningMQPubSub(codeBlock, socketID);
  }
}
