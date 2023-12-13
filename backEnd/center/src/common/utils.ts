import { HttpStatus } from '@nestjs/common';

export const ERRORS = {
  ROOM_EMPTY: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: '방 이름을 입력해주세요.',
  },
  URL_EMPTY: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'URL을 입력해주세요.',
  },
  USAGES_INVALID: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'CPU 사용량을 정확히 입력해주세요.',
  },
  URL_NOT_FOUND: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: '등록된 소켓 서버 URL을 찾을 수 없습니다.',
  },
};

export const EVENT = {
  SIGNALING: 'signalingCpu',
  CHAT: 'chatCpu',
};

export const USE_FULL = 100;
