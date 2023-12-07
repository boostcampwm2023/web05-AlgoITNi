import { HttpException, HttpStatus } from '@nestjs/common';

export class VulnerableException extends HttpException {
  constructor() {
    super('This code is not allowed', HttpStatus.FORBIDDEN);
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

export class TimeoutCodeRunning extends HttpException {
  constructor() {
    super(
      '코드실행 결과를 찾을 수 없습니다.',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export class ResourceNotFound extends HttpException {
  constructor(message = '요청하신 리소스를 찾을 수 없습니다.') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class RedisResponseError extends HttpException {
  constructor(message = '레디스에 병목 현상이 발생하였습니다.') {
    super(message, HttpStatus.TOO_MANY_REQUESTS);
  }
}

export class ExtNameException extends HttpException {
  constructor(message = '저장 파일의 확장자와 설정 언어가 일치하지 않습니다.') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class CrawlerException extends HttpException {
  constructor(message = '크롤링에 실패하였습니다.') {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
