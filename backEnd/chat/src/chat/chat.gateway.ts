import { ConfigService } from '@nestjs/config';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { JoinRoomDto } from './dto/join-room.dto';
import { LeaveRoomDto } from './dto/leave-room.dto';
import { MessageDto } from './dto/message.dto';
import * as os from 'os';
import { ERRORS, SOCKET, SOCKET_EVENT } from '../commons/utils';
import { ChatService } from './chat.service';
import axios from 'axios';

@WebSocketGateway({ namespace: SOCKET.NAME_SPACE, cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger();
  private roomToCount: Map<string, number> = new Map();
  private instanceId = process.env.NODE_APP_INSTANCE || os.hostname();
  private subscriberClient: Redis;
  private publisherClient: Redis;

  constructor(
    @InjectRedis() private readonly client: Redis,
    private readonly chatService: ChatService,
    private readonly configService: ConfigService,
  ) {
    this.subscriberClient = client.duplicate();
    this.publisherClient = client.duplicate();

    this.subscriberClient.subscribe(SOCKET.REDIS_CHAT_CHANEL);

    this.subscriberClient.on('message', this.handleChatMessage.bind(this));
  }

  private handleChatMessage(channel: string, message: string) {
    if (channel === SOCKET.REDIS_CHAT_CHANEL) {
      const { room, ...messageData } = JSON.parse(message);
      this.server.to(room).emit(SOCKET_EVENT.NEW_MESSAGE, messageData);
    }
  }

  handleConnection(socket: Socket) {
    this.logger.log(`Instance ${this.instanceId} - connected: ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`Instance ${this.instanceId} - disconnected: ${socket.id}`);
  }

  @SubscribeMessage(SOCKET_EVENT.JOIN_ROOM)
  handleJoin(
    @MessageBody() data: JoinRoomDto,
    @ConnectedSocket() socket: Socket,
  ) {
    this.logger.log(`Instance ${this.instanceId} - joinRoom: ${socket.id}`);

    const { room } = data;
    this.chatService.validateRoom(room);

    socket.join(room);

    const count = this.roomToCount.get(room) || 0;
    this.roomToCount.set(room, count + 1);
  }

  @SubscribeMessage(SOCKET_EVENT.LEAVE_ROOM)
  async handleLeave(
    @MessageBody() data: LeaveRoomDto,
    @ConnectedSocket() socket: Socket,
  ) {
    this.logger.log(`Instance ${this.instanceId} - leaveRoom: ${socket.id}`);

    const { room } = data;
    this.chatService.validateRoom(room);

    socket.leave(room);

    const count = (this.roomToCount.get(room) || 1) - 1;
    this.roomToCount.set(room, count);

    if (count === SOCKET.EMPTY_ROOM) {
      this.roomToCount.delete(room);
      this.chatService.deleteByRoom(room);
    }
  }

  @SubscribeMessage(SOCKET_EVENT.SEND_MESSAGE)
  async handleMessage(
    @MessageBody() data: MessageDto,
    @ConnectedSocket() socket: Socket,
  ) {
    this.logger.log(`Instance ${this.instanceId} - sendMessage: ${socket.id}`);

    this.chatService.validateSendMessage(data);

    const { room, message, nickname, ai } = data;

    const response = {
      room: room,
      message: message,
      nickname: nickname,
      socketId: socket.id,
      ai: ai,
    };

    if (ai) {
      try {
        await this.publisherClient.publish(
          SOCKET.REDIS_CHAT_CHANEL,
          JSON.stringify({ room: room, using: true }),
        );

        const llmMessageDto: LLMMessageDto = await this.processAIResponse(
          room,
          message,
          socket.id,
        );

        await this.chatService.insertOrUpdate(room, llmMessageDto);
        response.message = llmMessageDto.content;
      } catch (error) {
        throw new WsException({
          statusCode: ERRORS.FAILED_ACCESS_LLM.statusCode,
          message: ERRORS.FAILED_ACCESS_LLM.message,
        });
      }
    }

    try {
      await this.publisherClient.publish(
        SOCKET.REDIS_CHAT_CHANEL,
        JSON.stringify(response),
      );
    } catch (error) {
      throw new WsException({
        statusCode: ERRORS.FAILED_PUBLISHING.statusCode,
        message: ERRORS.FAILED_PUBLISHING.message,
      });
    }
  }

  public getRoomCount(room: string): number {
    return this.roomToCount.get(room) || 0;
  }

  public async useLLM(room: string, message: string, socketId: string) {
    const url = this.configService.get<string>('LLM_URL');
    const headers = {
      'X-NCP-CLOVASTUDIO-API-KEY':
        this.configService.get<string>('CLOVASTUDIO'),
      'X-NCP-APIGW-API-KEY': this.configService.get<string>('APIGW'),
      'X-NCP-CLOVASTUDIO-REQUEST-ID':
        this.configService.get<string>('REQUESTID'),
      ContentType: this.configService.get<string>('ContentType'),
      Accept: this.configService.get<string>('Accept'),
    };

    const newMessage: LLMMessageDto = {
      role: 'user',
      content: message,
    };

    const llmHistory: LLMHistoryDto = await this.chatService.insertOrUpdate(
      room,
      newMessage,
    );

    const data: LLMRequestDto = {
      messages: llmHistory.messages,
      topP: 0.8,
      topK: 0,
      maxTokens: 256,
      temperature: 0.5,
      repeatPenalty: 5.0,
      stopBefore: [],
      includeAiFilters: true,
    };

    try {
      const response = await axios.post(url, data, {
        headers,
        responseType: 'stream',
      });
      return response.data;
    } catch (error) {
      this.logger.error(`sendMessage from ${socketId} is failed`);
      throw error;
    }
  }

  async processAIResponse(
    room: string,
    message: string,
    socketId: string,
  ): Promise<LLMMessageDto> {
    const llmHistoryStream = await this.useLLM(room, message, socketId);
    const response = [];

    llmHistoryStream.on('data', (chunk) => {
      const lines = chunk.toString().split('\n\n');
      lines.forEach((line) => {
        response.push(line);
      });
    });

    return new Promise((resolve, reject) => {
      llmHistoryStream.on('end', () => {
        const resultIndex = response.findIndex((line) =>
          line.includes('event:result'),
        );
        const resultLine = response[resultIndex];
        const data = resultLine.split('data:')[1].trim();
        try {
          const dataJson = JSON.parse(data);
          const message = dataJson.message;
          resolve({
            role: message.role,
            content: message.content,
          });
        } catch (error) {
          reject('JSON parsing error');
        }
      });
    });
  }
}
