import { Body, Controller, Post } from '@nestjs/common';
import { CodesService } from './codes.service';
import { RequestCodeDto } from './dto/request-code.dto';

@Controller('codes')
export class CodesController {
  constructor(private readonly codesService: CodesService) {}

  @Post('/python')
  async runPython(@Body() codeBlock: RequestCodeDto) {
    return await this.codesService.runCode(codeBlock);
  }

  @Post('/js')
  async runJavascript(@Body() codeBlock: RequestCodeDto) {
    return await this.codesService.runCode(codeBlock);
  }
}
