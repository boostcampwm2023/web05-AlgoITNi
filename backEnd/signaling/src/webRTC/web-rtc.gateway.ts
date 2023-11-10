import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

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
    @MessageBody() data: { room: string },
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

    socket.emit('all_users', { users: users });
  }

  @SubscribeMessage('offer')
  handleOffer(
    @MessageBody()
    data: {
      sdp: RTCSessionDescription;
      offerSendId: string;
      offerReceiveId: string;
    },
    @ConnectedSocket() socket: Socket,
  ) {
    const { sdp, offerSendId, offerReceiveId } = data;
    socket.to(offerReceiveId).emit('getOffer', {
      sdp: sdp,
      offerSendId: offerSendId,
    });
  }

  @SubscribeMessage('answer')
  handleAnswer(
    @MessageBody()
    data: {
      sdp: RTCSessionDescription;
      answerSendId: string;
      answerReceiveId: string;
    },
    @ConnectedSocket() socket: Socket,
  ) {
    const { sdp, answerSendId, answerReceiveId } = data;
    socket.to(answerReceiveId).emit('getAnswer', {
      sdp: sdp,
      answerSendId: answerSendId,
    });
  }

  @SubscribeMessage('candidate')
  handleIceCandidate(
    @MessageBody()
    data: {
      candidate: any;
      candidateSendId: string;
      candidateReceiveId: string;
    },
    @ConnectedSocket() socket: Socket,
  ) {
    const { candidate, candidateSendId, candidateReceiveId } = data;
    socket.to(candidateReceiveId).emit('getCandidate', {
      candidate: candidate,
      candidateSendId: candidateSendId,
    });
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
    socket.to(roomID).emit('user_exit', { id: socket.id });
  }
}
