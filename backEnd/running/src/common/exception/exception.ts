import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenException extends HttpException {
  constructor() {
    super('Forbidden', HttpStatus.FORBIDDEN);
  }
}

export class DBException extends Error {
  status: number;
  constructor() {
    super('DBException');
    this.status = HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
