import { HttpStatus } from '@nestjs/common';

export const ERRORS = {
  TRANSACTION_INTERCEPTOR_REQUIRED: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: '쿼리러너 데코레이터를 사용하려면 트랙잭션 인터셉터가 필요합니다.',
  },
  TRANSACTION_ROLLBACK: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: '트랜잭션이 롤백되었습니다.',
  },
};
