import { HttpStatus } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as process from 'process';

export const ERRORS = {
  REQUEST_INVALID: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: '잘못된 요청입니다.',
  },
};

export const execPromise = promisify(exec);

export const REDIS = {
  CHANNEL: 'completed',
  QUEUE: process.env.NODE_ENV === 'dev' ? 'task-dev' : 'task',
};

export const Messages = {
  TIMEOUT: '코드가 실행되는데 너무 오래 걸립니다.',
  UNKNOWN: '알 수 없는 에러가 발생했습니다.',
};
