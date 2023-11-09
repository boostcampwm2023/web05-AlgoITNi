import { io } from 'socket.io-client/debug';
import { SOCKET_URL } from '@/constants/urls';
import createPeerConnection from './RTC';
import { SOCKET_EMIT_EVENT, SOCKET_RECEIVE_EVENT } from '@/constants/socketEvents';
import { streamModel } from '@/stores/StreamModel';

export const RTCConnectionList: Record<string, RTCPeerConnection> = {};

export const createSocket = (localStream: MediaStream) => {
  const socket = io(SOCKET_URL);

  socket.on(SOCKET_RECEIVE_EVENT.ALL_USERS, async (data: { users: Array<{ id: string }> }) => {
    data.users.forEach((user) => {
      RTCConnectionList[user.id] = createPeerConnection(user.id, socket, localStream);
    });

    Object.entries(RTCConnectionList).forEach(async ([key, value]) => {
      const offer = await value.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });

      await value.setLocalDescription(new RTCSessionDescription(offer));
      socket.emit(SOCKET_EMIT_EVENT.OFFER, {
        sdp: offer,
        offerSendId: socket.id,
        offerReceiveId: key,
      });
    });
  });

  socket.on(SOCKET_RECEIVE_EVENT.OFFER, async (data: { sdp: RTCSessionDescription; offerSendId: string }) => {
    RTCConnectionList[data.offerSendId] = createPeerConnection(data.offerSendId, socket, localStream);
    await RTCConnectionList[data.offerSendId].setRemoteDescription(new RTCSessionDescription(data.sdp));
    const answer = await RTCConnectionList[data.offerSendId].createAnswer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });

    await RTCConnectionList[data.offerSendId].setLocalDescription(new RTCSessionDescription(answer));
    socket.emit(SOCKET_EMIT_EVENT.ANSWER, {
      sdp: answer,
      answerSendId: socket.id,
      answerReceiveId: data.offerSendId,
    });
  });

  socket.on(SOCKET_RECEIVE_EVENT.ANSWER, (data: { sdp: RTCSessionDescription; answerSendId: string }) => {
    RTCConnectionList[data.answerSendId].setRemoteDescription(new RTCSessionDescription(data.sdp));
  });

  socket.on(SOCKET_RECEIVE_EVENT.CANDIDATE, (data: { candidate: RTCIceCandidateInit; candidateSendId: string }) => {
    if (RTCConnectionList[data.candidateSendId].remoteDescription)
      RTCConnectionList[data.candidateSendId].addIceCandidate(new RTCIceCandidate(data.candidate));
  });

  socket.on(SOCKET_RECEIVE_EVENT.USER_EXIT, (data: { id: string }) => {
    RTCConnectionList[data.id].close();
    delete RTCConnectionList[data.id];
    streamModel.removeStream(data.id);
  });

  return socket;
};
