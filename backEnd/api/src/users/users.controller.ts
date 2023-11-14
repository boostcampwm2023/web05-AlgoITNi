import { Controller, Get, Logger } from '@nestjs/common';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger();
  constructor() {}
  @Get()
  login() {
    this.logger.log('log', UsersController.name);
    this.logger.error('error', UsersController.name);
    this.logger.warn('warn', UsersController.name);
    this.logger.verbose('verbose', UsersController.name);
    this.logger.debug('debug', UsersController.name);

    return 'user login';
  }
}
