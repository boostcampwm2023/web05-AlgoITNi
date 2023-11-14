import { Body, Controller, Post } from '@nestjs/common';
import { CodesService } from './codes.service';
import { CodeDto } from './dto/code.dto';

@Controller('codes')
export class CodesController {
  constructor(private readonly codesService: CodesService) {}

  @Post('/python')
  async runPython(@Body() data: CodeDto) {
    return await this.codesService.testCode(data.code);
  }

  @Post('/test')
  async test() {
    const code = 'N,M = 5,6; print(N+M)';
    return await this.codesService.testCode(code);
  }
}
