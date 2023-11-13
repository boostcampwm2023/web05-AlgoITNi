import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client/debug';
import { SOCKET_EMIT_EVENT, SOCKET_RECEIVE_EVENT } from '@/constants/socketEvents';
import { SOCKET_URL } from '@/constants/urls';

const useRoom = (roomId: string) => {
  const [RTCConnections, setRTCConnections] = useState<Record<string, RTCPeerConnection>>({});
  const [streamList, setStreamList] = useState<{ id: string; stream: MediaStream }[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const localStream = useRef<MediaStream | null>(null);

  const tempRTCConnections: Record<string, RTCPeerConnection> = {};

  const socket = io(SOCKET_URL);

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
      iceServers: [{ urls: 'stun:stun.1.google.com:19302' }],
    });

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
      tempRTCConnections[user.id] = createPeerConnection(user.id);
    });

    Object.entries(tempRTCConnections).forEach(async ([key, value]) => {
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
    tempRTCConnections[data.offerSendId] = createPeerConnection(data.offerSendId);

    await tempRTCConnections[data.offerSendId].setRemoteDescription(new RTCSessionDescription(data.sdp));

    const answer = await tempRTCConnections[data.offerSendId].createAnswer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });

    await tempRTCConnections[data.offerSendId].setLocalDescription(new RTCSessionDescription(answer));

    socket.emit(SOCKET_EMIT_EVENT.ANSWER, {
      sdp: answer,
      answerSendId: socket.id,
      answerReceiveId: data.offerSendId,
    });
  });

  socket.on(SOCKET_RECEIVE_EVENT.ANSWER, (data: { sdp: RTCSessionDescription; answerSendId: string }) => {
    tempRTCConnections[data.answerSendId].setRemoteDescription(new RTCSessionDescription(data.sdp));

    setRTCConnections(tempRTCConnections);
  });

  socket.on(SOCKET_RECEIVE_EVENT.CANDIDATE, (data: { candidate: RTCIceCandidateInit; candidateSendId: string }) => {
    tempRTCConnections[data.candidateSendId].addIceCandidate(new RTCIceCandidate(data.candidate));

    setRTCConnections(tempRTCConnections);
  });

  socket.on(SOCKET_RECEIVE_EVENT.USER_EXIT, (data: { id: string }) => {
    tempRTCConnections[data.id].close();
    delete tempRTCConnections[data.id];

    setStreamList((prev) => prev.filter((stream) => stream.id !== data.id));
    setRTCConnections(tempRTCConnections);
  });

  return { videoRef, socket, RTCConnections, streamList };
};

export default useRoom;
