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
