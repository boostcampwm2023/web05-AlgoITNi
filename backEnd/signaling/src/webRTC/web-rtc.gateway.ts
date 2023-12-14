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
import { UserIdDto } from './dto/user-id.dto';
import { SOCKET, SOCKET_EVENT } from 'src/common/utils';
import { Logger } from '@nestjs/common';
import { WebRtcService } from './web-rtc.service';

@WebSocketGateway({ namespace: SOCKET.NAME_SPACE, cors: true })
export class WebRtcGateway implements OnGatewayConnection {
  private readonly logger = new Logger();
  @WebSocketServer()
  server: Server;

  roomToUsers: Map<string, any> = new Map();
  socketToRoom: Map<string, string> = new Map();

  constructor(private readonly webRtcService: WebRtcService) {}

  handleConnection(socket: Socket) {
    this.logger.log(`on connect called : ${socket.id}`);
  }

  @SubscribeMessage(SOCKET_EVENT.JOIN_ROOM)
  handleJoin(
    @MessageBody() data: JoinRoomDto,
    @ConnectedSocket() socket: Socket,
  ) {
    this.logger.log(`on joinRoom called : ${socket.id}`);
    this.webRtcService.validateJoinRoom(data);
    const { room } = data;

    const existingRoom = this.roomToUsers.get(room);
    if (existingRoom) {
      const count = existingRoom.length;

      if (count === SOCKET.ROOM_FULL) {
        const socketId = socket.id;
        socket.to(socketId).emit(SOCKET_EVENT.ROOM_FULL);
      }

      this.webRtcService.isRoomFull(existingRoom.length);
      existingRoom.push({ id: socket.id });
      this.roomToUsers.set(room, existingRoom);
    } else {
      this.roomToUsers.set(room, [{ id: socket.id }]);
    }

    this.socketToRoom.set(socket.id, room);
    socket.join(room);

    const usersInRoom = this.roomToUsers
      .get(room)
      .filter((user) => user.id !== socket.id);
    const roomUsersDto: RoomUsersDto = { users: usersInRoom };

    socket.emit(SOCKET_EVENT.ALL_USERS, roomUsersDto);
  }

  @SubscribeMessage(SOCKET_EVENT.OFFER)
  handleOffer(
    @MessageBody()
    data: GetOfferDto,
    @ConnectedSocket() socket: Socket,
  ) {
    this.logger.log(`on offer called : ${socket.id}`);
    this.webRtcService.validateOffer(data);
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
    this.webRtcService.validateAnswer(data);
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
    this.webRtcService.validateCandidate(data);
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
    const roomID = this.socketToRoom.get(socket.id);
    this.socketToRoom.delete(socket.id);

    const roomUsers = this.roomToUsers.get(roomID);
    if (roomUsers) {
      const afterLeave = roomUsers.filter((user) => user.id !== socket.id);
      if (afterLeave.length === SOCKET.ROOM_EMPTY) {
        this.roomToUsers.delete(roomID);
      } else {
        this.roomToUsers.set(roomID, afterLeave);
      }
    }
    const id = socket.id;
    const userIdDto: UserIdDto = { id };
    socket.to(roomID).emit(SOCKET_EVENT.USER_EXIT, userIdDto);
  }
}
