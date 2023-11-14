import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
@Controller()
export class AppController {
  private readonly logger = new Logger();

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
