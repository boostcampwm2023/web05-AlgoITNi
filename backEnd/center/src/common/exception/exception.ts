import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidateDtoException extends HttpException {
  constructor(message: string = 'DTO 유효성 검사에서 실패했습니다.') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class URLNotFoundException extends HttpException {
  constructor(message: string = '소켓 URL을 조회할 수 없습니다.') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
