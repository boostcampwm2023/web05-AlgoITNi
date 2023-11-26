import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { JoinRoomDto } from './dto/join-room.dto';
import { LeaveRoomDto } from './dto/leave-room.dto';
import { MessageDto } from './dto/message.dto';
import * as os from 'os';
import { SOCKET, SOCKET_EVENT } from '../commons/utils';
import { ChatService } from './chat.service';

@WebSocketGateway({ namespace: SOCKET.NAME_SPACE, cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger();
  private rooms: Map<string, boolean> = new Map();
  private roomToCount: Map<string, number> = new Map();
  private instanceId = process.env.NODE_APP_INSTANCE || os.hostname();
  private subscriberClient: Redis;
  private publisherClient: Redis;

  constructor(
    @InjectRedis() private readonly client: Redis,
    private readonly chatService: ChatService,
  ) {
    this.subscriberClient = client.duplicate();
    this.publisherClient = client.duplicate();
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

    const isRoom = this.rooms.get(room);
    const count = this.roomToCount.get(room) || 0;
    this.roomToCount.set(room, count + 1);

    if (!isRoom) {
      this.subscriberClient.subscribe(room);
      this.subscriberClient.on('message', (channel, message) => {
        if (channel === room) {
          this.server.to(room).emit(SOCKET_EVENT.NEW_MESSAGE, message);
        }
      });
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
      this.subscriberClient.unsubscribe(room);
      this.rooms.delete(room);
    }
  }

  @SubscribeMessage(SOCKET_EVENT.SEND_MESSAGE)
  async handleMessage(
    @MessageBody() data: MessageDto,
    @ConnectedSocket() socket: Socket,
  ) {
    this.logger.log(`Instance ${this.instanceId} - sendMessage: ${socket.id}`);

    const { room, message } = data;

    this.chatService.validateRoom(room);
    this.chatService.validateMessage(message);

    const response = {
      message: message,
    };
    this.publisherClient.publish(room, JSON.stringify(response));
  }
}
