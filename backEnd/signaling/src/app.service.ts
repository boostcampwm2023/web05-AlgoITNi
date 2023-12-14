import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger();

  getHello(): string {
    this.logger.log('signalling server');
    return 'Hello World!';
  }
}
