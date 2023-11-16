import { HttpStatus } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';

export const ERRORS = {
  REQUEST_INVALID: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: '잘못된 요청입니다.',
  },
};

export const execPromise = promisify(exec);
