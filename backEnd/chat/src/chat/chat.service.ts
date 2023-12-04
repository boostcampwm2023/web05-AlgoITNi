import { Injectable, HttpStatus } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { ERRORS } from '../commons/utils';
import { MessageDto } from './dto/message.dto';

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

  validateSendMessage(data: MessageDto) {
    if (!data.message || !data.nickname || !data.room) {
      throw new WsException({
        statusCode: ERRORS.SEND_MESSAGE.statusCode,
        message: ERRORS.SEND_MESSAGE.message,
      });
    }
  }
}
