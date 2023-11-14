import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client/debug';
import { SOCKET_EMIT_EVENT, SOCKET_RECEIVE_EVENT } from '@/constants/socketEvents';

const useRoom = (roomId: string) => {
  const [streamList, setStreamList] = useState<{ id: string; stream: MediaStream }[]>([]);
  const [dataChannels, setDataChannels] = useState<{ id: string; dataChannel: RTCDataChannel }[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const localStream = useRef<MediaStream | null>(null);

  const RTCConnections: Record<string, RTCPeerConnection> = {};

  const socket = io(`${import.meta.env.VITE_SOCKET_URL}`);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
      })
      .then((video) => {
        if (videoRef.current) videoRef.current.srcObject = video;

        localStream.current = video;

        socket.connect();
        socket.emit(SOCKET_EMIT_EVENT.JOIN_ROOM, {
          room: roomId,
        });
      });
  }, []);

  const createPeerConnection = (socketId: string): RTCPeerConnection => {
    const RTCConnection = new RTCPeerConnection({
      iceServers: [
        { urls: import.meta.env.VITE_STUN_URL },
        {
          urls: import.meta.env.VITE_TURN_URL,
          username: import.meta.env.VITE_TURN_USERNAME,
          credential: import.meta.env.VITE_TURN_CREDENTIAL,
        },
      ],
    });

    const newDataChannel = RTCConnection.createDataChannel('edit', { negotiated: true, id: 0 });
    setDataChannels((prev) => [...prev, { id: socketId, dataChannel: newDataChannel }]);

    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => {
        RTCConnection.addTrack(track, localStream.current as MediaStream);
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
      setStreamList((prev) => [...prev, { id: socketId, stream: e.streams[0] }]);
    });

    return RTCConnection;
  };

  socket.on(SOCKET_RECEIVE_EVENT.ALL_USERS, async (data: { users: Array<{ id: string }> }) => {
    data.users.forEach((user) => {
      RTCConnections[user.id] = createPeerConnection(user.id);
    });

    Object.entries(RTCConnections).forEach(async ([key, value]) => {
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
    RTCConnections[data.offerSendId] = createPeerConnection(data.offerSendId);

    await RTCConnections[data.offerSendId].setRemoteDescription(new RTCSessionDescription(data.sdp));

    const answer = await RTCConnections[data.offerSendId].createAnswer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });

    await RTCConnections[data.offerSendId].setLocalDescription(new RTCSessionDescription(answer));

    socket.emit(SOCKET_EMIT_EVENT.ANSWER, {
      sdp: answer,
      answerSendId: socket.id,
      answerReceiveId: data.offerSendId,
    });
  });

  socket.on(SOCKET_RECEIVE_EVENT.ANSWER, (data: { sdp: RTCSessionDescription; answerSendId: string }) => {
    RTCConnections[data.answerSendId].setRemoteDescription(new RTCSessionDescription(data.sdp));
  });

  socket.on(SOCKET_RECEIVE_EVENT.CANDIDATE, (data: { candidate: RTCIceCandidateInit; candidateSendId: string }) => {
    RTCConnections[data.candidateSendId].addIceCandidate(new RTCIceCandidate(data.candidate));
  });

  socket.on(SOCKET_RECEIVE_EVENT.USER_EXIT, (data: { id: string }) => {
    RTCConnections[data.id].close();
    delete RTCConnections[data.id];

    setDataChannels((prev) => prev.filter(({ id }) => id !== data.id));
    setStreamList((prev) => prev.filter((stream) => stream.id !== data.id));
  });

  return { videoRef, socket, RTCConnections, streamList, dataChannels };
};

export default useRoom;
