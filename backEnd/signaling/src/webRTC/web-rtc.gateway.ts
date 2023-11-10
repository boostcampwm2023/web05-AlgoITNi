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

@WebSocketGateway({ namespace: 'signaling', cors: true })
export class WebRtcGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  users = {};
  socketToRoom = {};
  maximum = 4;

  handleConnection(socket: Socket) {
    console.log(`on connect called : ${socket.id}`);
  }

  @SubscribeMessage('join_room')
  handleJoin(
    @MessageBody() data: JoinRoomDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const { room } = data;

    if (this.users[room]) {
      const length = this.users[room].length;
      if (length === this.maximum) {
        socket.emit('room_full');
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

    socket.emit('all_users', roomUsersDto);
  }

  @SubscribeMessage('offer')
  handleOffer(
    @MessageBody()
    data: GetOfferDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const { sdp, offerSendId, offerReceiveId } = data;
    const postOfferDto: PostOfferDto = { sdp, offerSendId };
    socket.to(offerReceiveId).emit('getOffer', postOfferDto);
  }

  @SubscribeMessage('answer')
  handleAnswer(
    @MessageBody()
    data: GetAnswerDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const { sdp, answerSendId, answerReceiveId } = data;
    const postAnswerDto: PostAnswerDto = { sdp, answerSendId };
    socket.to(answerReceiveId).emit('getAnswer', postAnswerDto);
  }

  @SubscribeMessage('candidate')
  handleIceCandidate(
    @MessageBody()
    data: GetIceCandidateDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const { candidate, candidateSendId, candidateReceiveId } = data;
    const postIceCandidateDto: PostIceCandidateDto = {
      candidate,
      candidateSendId,
    };
    socket.to(candidateReceiveId).emit('getCandidate', postIceCandidateDto);
  }

  @SubscribeMessage('disconnect')
  handleDisconnect(@ConnectedSocket() socket: Socket) {
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
    socket.to(roomID).emit('user_exit', userIdDto);
  }
}
