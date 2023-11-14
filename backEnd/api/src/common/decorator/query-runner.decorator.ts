import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { TransactionInterceptorRequired } from '../exception/exception';
export const QueryRunner = createParamDecorator(
  (data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    if (!request.queryRunner) {
      new TransactionInterceptorRequired();
    }

    return request.queryRunner;
  },
);
