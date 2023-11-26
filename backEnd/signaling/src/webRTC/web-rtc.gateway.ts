import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JoinRoomDto } from './dto/join-room.dto';
import { GetOfferDto } from './dto/get-offer.dto';
import { GetAnswerDto } from './dto/get-answer.dto';
import { GetIceCandidateDto } from './dto/get-ice.dto';
import { PostAnswerDto } from './dto/post-answer.dto';
import { PostIceCandidateDto } from './dto/post-ice.dto';
import { PostOfferDto } from './dto/post-offer.dto';
import { RoomUsersDto } from './dto/room-users.dto';
import { UserIdDto } from './dto/user-id.dto copy';
import { SOCKET, SOCKET_EVENT } from 'src/common/utils';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ namespace: SOCKET.NAME_SPACE, cors: true })
export class WebRtcGateway implements OnGatewayConnection {
  private readonly logger = new Logger();
  @WebSocketServer()
  server: Server;

  users = {};
  socketToRoom = {};
  maximum = SOCKET.MAXIMUM;

  handleConnection(socket: Socket) {
    this.logger.log(`on connect called : ${socket.id}`);
  }

  @SubscribeMessage(SOCKET_EVENT.JOIN_ROOM)
  handleJoin(
    @MessageBody() data: JoinRoomDto,
    @ConnectedSocket() socket: Socket,
  ) {
    this.logger.log(`on joinRoom called : ${socket.id}`);
    const { room } = data;
    if (this.users[room]) {
      const length = this.users[room].length;
      if (length === this.maximum) {
        socket.emit(SOCKET_EVENT.ROOM_FULL);
        return;
      }
      this.users[room].push({ id: socket.id });
    } else {
      this.users[room] = [{ id: socket.id }];
    }
    this.socketToRoom[socket.id] = room;
    socket.join(room);

    const users = this.users[room].filter((user) => user.id !== socket.id);

    const roomUsersDto: RoomUsersDto = { users };

    socket.emit(SOCKET_EVENT.ALL_USERS, roomUsersDto);
  }

  @SubscribeMessage(SOCKET_EVENT.OFFER)
  handleOffer(
    @MessageBody()
    data: GetOfferDto,
    @ConnectedSocket() socket: Socket,
  ) {
    this.logger.log(`on offer called : ${socket.id}`);
    const { sdp, offerSendId, offerReceiveId } = data;
    const postOfferDto: PostOfferDto = { sdp, offerSendId };
    socket.to(offerReceiveId).emit(SOCKET_EVENT.GET_OFFER, postOfferDto);
  }

  @SubscribeMessage(SOCKET_EVENT.ANSWER)
  handleAnswer(
    @MessageBody()
    data: GetAnswerDto,
    @ConnectedSocket() socket: Socket,
  ) {
    this.logger.log(`on answer called : ${socket.id}`);
    const { sdp, answerSendId, answerReceiveId } = data;
    const postAnswerDto: PostAnswerDto = { sdp, answerSendId };
    socket.to(answerReceiveId).emit(SOCKET_EVENT.GET_ANSWER, postAnswerDto);
  }

  @SubscribeMessage(SOCKET_EVENT.CANDIDATE)
  handleIceCandidate(
    @MessageBody()
    data: GetIceCandidateDto,
    @ConnectedSocket() socket: Socket,
  ) {
    this.logger.log(`on candidate called : ${socket.id}`);
    const { candidate, candidateSendId, candidateReceiveId } = data;
    const postIceCandidateDto: PostIceCandidateDto = {
      candidate,
      candidateSendId,
    };
    socket
      .to(candidateReceiveId)
      .emit(SOCKET_EVENT.GET_CANDIDATE, postIceCandidateDto);
  }

  @SubscribeMessage(SOCKET_EVENT.DISCONNECT)
  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`on disconnected called : ${socket.id}`);
    const roomID = this.socketToRoom[socket.id];
    let room = this.users[roomID];
    if (room) {
      room = room.filter((user) => user.id !== socket.id);
      this.users[roomID] = room;
      if (room.length === 0) {
        delete this.users[roomID];
      }
    }
    const id = socket.id;
    const userIdDto: UserIdDto = { id };
    socket.to(roomID).emit(SOCKET_EVENT.USER_EXIT, userIdDto);
  }
}
