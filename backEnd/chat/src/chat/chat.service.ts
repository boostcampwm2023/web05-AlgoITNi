import { Injectable, HttpStatus } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { ERRORS } from '../commons/utils';

@Injectable()
export class ChatService {
  validateRoom(room: string) {
    if (!room) {
      throw new WsException({
        statusCode: ERRORS.ROOM_EMPTY.statusCode,
        message: ERRORS.ROOM_EMPTY.message,
      });
    }
  }

  validateMessage(message: string) {
    if (!message) {
      throw new WsException({
        statusCode: ERRORS.MESSAGE_EMPTY.statusCode,
        message: ERRORS.MESSAGE_EMPTY.message,
      });
    }
  }

  validateNickname(nickname: string) {
    if (!nickname) {
      throw new WsException({
        statusCode: ERRORS.ROOM_EMPTY.statusCode,
        message: ERRORS.ROOM_EMPTY.message,
      });
    }
  }
}
