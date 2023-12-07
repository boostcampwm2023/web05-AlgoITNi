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
import { JoinRoomDto } from './dto/join-room.dto';
import { LeaveRoomDto } from './dto/leave-room.dto';
import { MessageDto } from './dto/message.dto';
import { SOCKET, SOCKET_EVENT } from '../commons/utils';
import { ChatService } from './chat.service';

@WebSocketGateway({ namespace: SOCKET.V1, cors: true })
export class ChatSingleGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger();

  constructor(private readonly chatService: ChatService) {}

  handleConnection(socket: Socket) {
    this.logger.log(`connected: ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`disconnected: ${socket.id}`);
  }

  @SubscribeMessage(SOCKET_EVENT.JOIN_ROOM)
  handleJoin(
    @MessageBody() data: JoinRoomDto,
    @ConnectedSocket() socket: Socket,
  ) {
    this.logger.log(`joinRoom: ${socket.id}`);

    const { room } = data;
    this.chatService.validateRoom(room);

    socket.join(room);
  }

  @SubscribeMessage(SOCKET_EVENT.LEAVE_ROOM)
  async handleLeave(
    @MessageBody() data: LeaveRoomDto,
    @ConnectedSocket() socket: Socket,
  ) {
    this.logger.log(`leaveRoom: ${socket.id}`);

    const { room } = data;
    this.chatService.validateRoom(room);

    socket.leave(room);
  }

  @SubscribeMessage(SOCKET_EVENT.SEND_MESSAGE)
  async handleMessage(
    @MessageBody() data: MessageDto,
    @ConnectedSocket() socket: Socket,
  ) {
    this.logger.log(`sendMessage: ${socket.id}`);

    this.chatService.validateSendMessage(data);

    const { room, message, nickname, ai } = data;

    const response = {
      room: room,
      message: message,
      nickname: nickname,
    };

    socket.to(room).emit(SOCKET_EVENT.SEND_MESSAGE, response);
  }
}
