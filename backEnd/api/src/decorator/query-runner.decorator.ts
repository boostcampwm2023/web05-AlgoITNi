import {
  ExecutionContext,
  HttpException,
  createParamDecorator,
} from '@nestjs/common';
import { ERRORS } from '../utils';
export const QueryRunner = createParamDecorator(
  (data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    if (!request.queryRunner) {
      new HttpException(
        ERRORS.TRANSACTION_INTERCEPTOR_REQUIRED.message,
        ERRORS.TRANSACTION_INTERCEPTOR_REQUIRED.statusCode,
      );
    }

    return request.queryRunner;
  },
);
