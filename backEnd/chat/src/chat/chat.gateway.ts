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

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection {
  private readonly logger = new Logger();
  @WebSocketServer()
  server: Server;

  constructor(@InjectRedis() private readonly client: Redis) {}

  handleConnection(socket: Socket) {
    this.logger.log(`on connect called : ${socket.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoin(
    @MessageBody() data: JoinRoomDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const { room } = data;
    socket.join(room);
  }

  @SubscribeMessage('leaveRoom')
  async handleLeave(
    @MessageBody() data: LeaveRoomDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const { room } = data;
    socket.leave(room);
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(
    @MessageBody() data: MessageDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const { room, message } = data;
    socket.to(room).emit('newMessage', message);
  }
}
