import { Socket } from 'socket.io-client/debug';

export interface ExtendedRTCPeerConnection extends RTCPeerConnection {
  stream?: MediaStream;
}

export const createPeerConnection = (socketId: string, socket: Socket, localStream: MediaStream) => {
  const RTCConnection = new RTCPeerConnection();
  if (localStream) {
    localStream.getTracks().forEach((track) => {
      RTCConnection.addTrack(track, localStream);
    });
  }
  const result: ExtendedRTCPeerConnection = {
    ...RTCConnection,
  };

  result.addEventListener('icecandidate', (e) => {
    socket.emit('candidate', {
      candidate: e.candidate,
      candidateSendId: socket.id,
      candidateReceiveId: socketId,
    });
  });

  result.addEventListener('track', (e) => {
    result.stream = e.streams[0];
  });

  return result;
};
