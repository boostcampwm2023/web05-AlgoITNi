import { Injectable, HttpStatus } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { ERRORS } from '../commons/utils';
import { MessageDto } from './dto/message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LLMHistory } from './schemas/llmHistory.schemas';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(LLMHistory.name) private readonly llmModel: Model<LLMHistory>,
  ) {}

  async insertOrUpdate(
    room: string,
    messageDto: LLMMessageDto,
  ): Promise<LLMHistoryDto> {
    let history = await this.llmModel.findOne({ room }).exec();

    if (history) {
      history.messages.push(messageDto);
    } else {
      history = new this.llmModel({
        room,
        messages: [messageDto],
      });
    }

    await history.save();

    const result: LLMHistoryDto = {
      messages: history.messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    };

    return result;
  }

  async deleteByRoom(room: string): Promise<any> {
    return await this.llmModel.findOneAndDelete({ room }).exec();
  }

  validateRoom(room: string) {
    if (!room) {
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
