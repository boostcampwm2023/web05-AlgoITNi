import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
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

@WebSocketGateway({ namespace: 'chat', cors: true })
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger();
  private rooms: Map<string, boolean> = new Map();
  private roomToCount: Map<string, number> = new Map();
  private instanceId = process.env.NODE_APP_INSTANCE || os.hostname();
  private subscriberClient: Redis;
  private publisherClient: Redis;

  constructor(@InjectRedis() private readonly client: Redis) {
    this.subscriberClient = client.duplicate();
    this.publisherClient = client.duplicate();
  }

  handleConnection(socket: Socket) {
    this.logger.log(`Instance ${this.instanceId} - connected: ${socket.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoin(
    @MessageBody() data: JoinRoomDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const { room } = data;
    socket.join(room);

    const isRoom = this.rooms.get(room);
    const count = this.roomToCount.get(room) || 0;
    this.roomToCount.set(room, count + 1);

    if (!isRoom) {
      this.subscriberClient.subscribe(room);
      this.subscriberClient.on('message', (channel, message) => {
        if (channel === room) {
          this.server.to(room).emit('newMessage', message);
        }
      });
      this.rooms.set(room, true);
    }
  }

  @SubscribeMessage('leaveRoom')
  async handleLeave(
    @MessageBody() data: LeaveRoomDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const { room } = data;
    socket.leave(room);

    const count = (this.roomToCount.get(room) || 1) - 1;
    this.roomToCount.set(room, count);

    if (count === 0) {
      this.subscriberClient.unsubscribe(room);
      this.rooms.delete(room);
    }
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(@MessageBody() data: MessageDto) {
    const { room, message } = data;
    const response = {
      message: message,
    };
    this.publisherClient.publish(room, JSON.stringify(response));
  }
}
