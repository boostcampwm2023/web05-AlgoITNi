import { HttpStatus } from '@nestjs/common';

export const SOCKET = {
  NAME_SPACE: 'chat',
  V1: 'single',
  KAFKA: 'kafka',
  EMPTY_ROOM: 0,
  REDIS_CHAT_CHANEL: 'RedisChatting',
};

export const SOCKET_EVENT = {
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',

  NEW_MESSAGE: 'new_message',
  SEND_MESSAGE: 'send_message',
};

export const ERRORS = {
  NICKNAME_EMPTY: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: '닉네임을 입력해주세요.',
  },
  ROOM_EMPTY: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: '방 이름을 입력해주세요.',
  },
  SEND_MESSAGE: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: '메시지를 보내는 과정에 에러가 발생했습니다.',
  },
  MESSAGE_EMPTY: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: '메시지를 입력해주세요.',
  },
  FAILED_PUBLISHING: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: '메시지를 PUB하는데 실패했습니다.',
  },
  FAILED_ACCESS_LLM: {
    statusCode: HttpStatus.TOO_MANY_REQUESTS,
    message: '클로바 스튜디오를 사용할 수 없습니다.',
  },
  FAILED_PARSING: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: '메시지 파싱에 실패하였습니다.',
  },
};
