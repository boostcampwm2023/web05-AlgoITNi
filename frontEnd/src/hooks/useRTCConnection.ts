/* eslint-disable @typescript-eslint/no-use-before-define */
import { useState, useEffect } from 'react';
import { Socket, io } from 'socket.io-client/debug';
import { SOCKET_EMIT_EVENT, SOCKET_RECEIVE_EVENT } from '@/constants/socketEvents';
import { VITE_SOCKET_URL, VITE_STUN_URL, VITE_TURN_CREDENTIAL, VITE_TURN_URL, VITE_TURN_USERNAME } from '@/constants/env';

const RTCConnections: Record<string, RTCPeerConnection> = {};
let socket: Socket;

const useRTCConnection = (roomId: string, localStream: MediaStream, isSetting: boolean) => {
  const [isConnect, setIsConnect] = useState(false);
  const [streamList, setStreamList] = useState<{ id: string; stream: MediaStream }[]>([]);
  const [dataChannels, setDataChannels] = useState<{ id: string; dataChannel: RTCDataChannel }[]>([]);

  const socketConnect = () => {
    fetch(VITE_SOCKET_URL, { method: 'POST', body: JSON.stringify({ roomName: roomId }) })
      .then((res) => res.json())
      .then((res) => {
        socket = io(res.result.url);
        socket.on(SOCKET_RECEIVE_EVENT.ALL_USERS, onAllUser);
        socket.on(SOCKET_RECEIVE_EVENT.OFFER, onOffer);
        socket.on(SOCKET_RECEIVE_EVENT.ANSWER, onAnswer);
        socket.on(SOCKET_RECEIVE_EVENT.CANDIDATE, onCandidate);
        socket.on(SOCKET_RECEIVE_EVENT.USER_EXIT, onUserExit);
        socket.connect();

        socket.emit(SOCKET_EMIT_EVENT.JOIN_ROOM, {
          room: roomId,
        });
        setIsConnect(true);
      });
  };

  useEffect(() => {
    if (localStream && isSetting) {
      if (!isConnect) socketConnect();
      else {
        Object.values(RTCConnections).forEach(async (peerConnection) => {
          const videoSender = peerConnection.getSenders().find((sender) => sender.track?.kind === 'video');
          const audioSender = peerConnection.getSenders().find((sender) => sender.track?.kind === 'audio');
          const currentTracks = localStream.getTracks();
          if (currentTracks) {
            const currentVideoTrack = currentTracks.find((track) => track?.kind === 'video');
            const currentAudioTrack = currentTracks.find((track) => track?.kind === 'audio');
            if (currentVideoTrack) await videoSender?.replaceTrack(currentVideoTrack);
            if (currentAudioTrack) await audioSender?.replaceTrack(currentAudioTrack);
          }
        });
      }
    }
  }, [localStream, isSetting]);

  const createPeerConnection = (socketId: string): RTCPeerConnection => {
    const RTCConnection = new RTCPeerConnection({
      iceServers: [
        { urls: VITE_STUN_URL },
        {
          urls: VITE_TURN_URL,
          username: VITE_TURN_USERNAME,
          credential: VITE_TURN_CREDENTIAL,
        },
      ],
    });

    const newDataChannel = RTCConnection.createDataChannel('edit', { negotiated: true, id: 0 });

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
      setStreamList((prev) => {
        const newArray = [...prev].filter(({ id }) => id !== socketId);
        return [...newArray, { id: socketId, stream: e.streams[0] }];
      });
    });
    setDataChannels((prev) => [...prev, { id: socketId, dataChannel: newDataChannel }]);

    return RTCConnection;
  };

  const onAllUser = async (data: { users: Array<{ id: string }> }) => {
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
  };

  const onOffer = async (data: { sdp: RTCSessionDescription; offerSendId: string }) => {
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
  };

  const onAnswer = (data: { sdp: RTCSessionDescription; answerSendId: string }) => {
    RTCConnections[data.answerSendId].setRemoteDescription(new RTCSessionDescription(data.sdp));
  };

  const onCandidate = (data: { candidate: RTCIceCandidateInit; candidateSendId: string }) => {
    RTCConnections[data.candidateSendId].addIceCandidate(new RTCIceCandidate(data.candidate));
  };

  const onUserExit = (data: { id: string }) => {
    RTCConnections[data.id].close();
    delete RTCConnections[data.id];

    setDataChannels((prev) => prev.filter(({ id }) => id !== data.id));
    setStreamList((prev) => prev.filter((stream) => stream.id !== data.id));
  };

  return { socket, streamList, dataChannels };
};

export default useRTCConnection;
