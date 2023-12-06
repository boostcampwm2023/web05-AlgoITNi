import * as process from 'process';

const timeUnit = {
  SECOND: 's',
  MINUTE: 'm',
  HOUR: 'h',
  DAY: 'd',
};

export const time = {
  SECOND: 1,
  MINUTE: 60,
  FIVE_MINUTE: 5 * 60,
  HOUR: 60 * 60,
  DAY: 60 * 60 * 24,
};

export const calcExpireSeconds = (expireString: string): number => {
  const regex = /^(\d+)([smhd])$/;
  const result = expireString.match(regex);
  if (result) {
    const num = result[1];
    const unit = result[2];
    switch (unit) {
      case timeUnit.SECOND:
        return 1000 * +num;
      case timeUnit.MINUTE:
        return 1000 * +num * 60;
      case timeUnit.HOUR:
        return 1000 * +num * 60 * 60;
      case timeUnit.DAY:
        return 1000 * +num * 24 * 60 * 60;
    }
  }
};

export function calcCookieExpire(expireString: string): Date {
  const date = new Date();
  const time = calcExpireSeconds(expireString);
  return new Date(date.getTime() + time);
}

export const jwtError = {
  EXPIRED: 'jwt expired',
  NO_TOKEN: 'jwt must be provided',
  IN_VALID: 'invalid token',
};

export const ResponseMessage = {
  NEED_LOGIN: '로그인이 필요합니다.',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  NOT_SUPPORT: '지원하지 않는 언어 타입입니다.',
};

export const SOCKET_EVENT = {
  NAME_SPACE: 'run',
  DISCONNECT: 'disconnect',
  REQUEST: 'request',
  DONE: 'done',
};

export const REDIS = {
  CHANNEL: 'completed',
  QUEUE: process.env.NODE_ENV === 'dev' ? 'task-dev' : 'task',
};

export const EVENT = {
  COMPLETE: 'job-complete',
};
