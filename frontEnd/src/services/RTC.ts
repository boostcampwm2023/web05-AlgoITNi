import { Socket } from 'socket.io-client/debug';
import { streamModel } from '@/stores/StreamModel';

const createPeerConnection = (socketId: string, socket: Socket, localStream: MediaStream) => {
  const RTCConnection = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.1.google.com:19302' }],
  });
  if (localStream) {
    localStream.getTracks().forEach((track) => {
      RTCConnection.addTrack(track, localStream);
    });
  }
  RTCConnection.addEventListener('icecandidate', (e) => {
    if (e.candidate != null)
      socket.emit('candidate', {
        candidate: e.candidate,
        candidateSendId: socket.id,
        candidateReceiveId: socketId,
      });
  });

  RTCConnection.addEventListener('track', (e) => {
    streamModel.addStream({ id: socketId, stream: e.streams[0] });
  });

  return RTCConnection;
};

export default createPeerConnection;
