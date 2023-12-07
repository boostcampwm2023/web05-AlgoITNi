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
import { JoinRoomDto } from './dto/join-room.dto';
import { LeaveRoomDto } from './dto/leave-room.dto';
import { MessageDto } from './dto/message.dto';
import * as os from 'os';
import { ERRORS, SOCKET, SOCKET_EVENT } from '../commons/utils';
import { ChatService } from './chat.service';
import { Kafka } from 'kafkajs';

@WebSocketGateway({ namespace: SOCKET.KAFKA, cors: true })
export class ChatKafkaGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger();
  private rooms: Map<string, boolean> = new Map();
  private roomToCount: Map<string, number> = new Map();
  private instanceId = process.env.NODE_APP_INSTANCE || os.hostname();

  private readonly kafka = new Kafka({
    clientId: `chat-server-${process.env.NODE_APP_INSTANCE || os.hostname()}`,
    brokers: ['localhost:9092'],
  });
  private readonly producer = this.kafka.producer();
  private readonly consumer = this.kafka.consumer({
    groupId: `chat-group-${process.env.NODE_APP_INSTANCE || os.hostname()}`,
  });

  constructor(private readonly chatService: ChatService) {
    this.initKafka();
  }

  handleConnection(socket: Socket) {
    this.logger.log(`connected: ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`disconnected: ${socket.id}`);
  }

  async initKafka() {
    await this.producer.connect();
    await this.consumer.connect();

    this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const parsedValue = JSON.parse(message.value.toString());
          this.server.to(topic).emit(SOCKET_EVENT.NEW_MESSAGE, parsedValue);
        } catch (error) {
          throw new WsException({
            statusCode: ERRORS.FAILED_PARSING.statusCode,
            message: ERRORS.FAILED_PARSING.message,
          });
        }
      },
    });
  }

  @SubscribeMessage(SOCKET_EVENT.JOIN_ROOM)
  async handleJoin(
    @MessageBody() data: JoinRoomDto,
    @ConnectedSocket() socket: Socket,
  ) {
    this.logger.log(`Instance ${this.instanceId} - joinRoom: ${socket.id}`);

    const { room } = data;
    this.chatService.validateRoom(room);

    socket.join(room);

    const isRoom = this.rooms.get(room);
    const count = this.roomToCount.get(room) || 0;
    this.roomToCount.set(room, count + 1);

    if (!isRoom) {
      await this.consumer.subscribe({ topic: room, fromBeginning: false });
      this.rooms.set(room, true);
    }
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
      this.rooms.delete(room);
      this.roomToCount.delete(room);
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

    const response = { message, nickname, ai };

    try {
      await this.producer.send({
        topic: room,
        messages: [{ value: JSON.stringify(response) }],
      });
    } catch (error) {
      throw new WsException({
        statusCode: ERRORS.FAILED_PUBLISHING.statusCode,
        message: ERRORS.FAILED_PUBLISHING.message,
      });
    }
  }
}
