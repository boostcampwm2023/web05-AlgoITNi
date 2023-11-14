import { HttpException, HttpStatus } from '@nestjs/common';

export class VulnerableException extends HttpException {
  constructor() {
    super('This code is not allowed', HttpStatus.FORBIDDEN);
  }
}

export class UnexpectedErrorEX extends Error {
  status: number;
  constructor() {
    super('에러가 발생했습니다!');
    this.status = HttpStatus.INTERNAL_SERVER_ERROR;
  }
}

export class TransactionInterceptorRequired extends HttpException {
  constructor() {
    super(
      '쿼리러너 데코레이터를 사용하려면 트랙잭션 인터셉터가 필요합니다.',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export class TransactionRollback extends HttpException {
  constructor() {
    super('트랜잭션이 롤백되었습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
