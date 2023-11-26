import { HttpStatus } from '@nestjs/common';

export const SOCKET = {
  NAME_SPACE: 'signaling',
  ROOM_FULL: 4,
  ROOM_EMPTY: 0,
};

export const SOCKET_EVENT = {
  JOIN_ROOM: 'join_room',
  ROOM_FULL: 'room_full',

  ALL_USERS: 'all_users',
  USER_EXIT: 'user_exit',
  DISCONNECT: 'disconnect',

  OFFER: 'offer',
  ANSWER: 'answer',
  CANDIDATE: 'candidate',
  GET_OFFER: 'getOffer',
  GET_ANSWER: 'getAnswer',
  GET_CANDIDATE: 'getCandidate',
};

export const ERRORS = {
  ROOM_FULL: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: '해당 방에 인원이 가득찼습니다.',
  },
  FAIL_JOIN_ROOM: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'ROOM JOIN에 실패하였습니다.',
  },
  FAIL_OFFER: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'OFFER에 실패하였습니다.',
  },
  FAIL_ANSWER: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'ANSWER에 실패하였습니다.',
  },
  FAIL_CANDIDATE: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'CANDIDATE에 실패하였습니다.',
  },
};
