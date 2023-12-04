/* eslint-disable @typescript-eslint/no-use-before-define */
import { useState, useEffect } from 'react';
import { Socket, io } from 'socket.io-client/debug';
import { RTC_SOCKET_EMIT_EVENT, RTC_SOCKET_RECEIVE_EVENT } from '@/constants/rtcSocketEvents';
import { VITE_STUN_URL, VITE_TURN_CREDENTIAL, VITE_TURN_URL, VITE_TURN_USERNAME } from '@/constants/env';
import { DataChannel } from '@/types/RTCConnection';
import getSocketURL from '@/apis/getSocketURL';

const RTCConnections: Record<string, RTCPeerConnection> = {};
let socket: Socket;

const useRTCConnection = (roomId: string, localStream: MediaStream, isSetting: boolean) => {
  const [isConnect, setIsConnect] = useState(false);
  const [streamList, setStreamList] = useState<{ id: string; stream: MediaStream }[]>([]);
  const [codeDataChannels, setCodeDataChannels] = useState<DataChannel[]>([]);
  const [languageDataChannels, setLanguageDataChannels] = useState<DataChannel[]>([]);

  const socketConnect = async () => {
    const socketURL = await getSocketURL(roomId);

    socket = io(socketURL);
    socket.on(RTC_SOCKET_RECEIVE_EVENT.ALL_USERS, onAllUser);
    socket.on(RTC_SOCKET_RECEIVE_EVENT.OFFER, onOffer);
    socket.on(RTC_SOCKET_RECEIVE_EVENT.ANSWER, onAnswer);
    socket.on(RTC_SOCKET_RECEIVE_EVENT.CANDIDATE, onCandidate);
    socket.on(RTC_SOCKET_RECEIVE_EVENT.USER_EXIT, onUserExit);
    socket.connect();

    socket.emit(RTC_SOCKET_EMIT_EVENT.JOIN_ROOM, {
      room: roomId,
    });

    setIsConnect(true);
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

    const newCodeDataChannel = RTCConnection.createDataChannel('code', { negotiated: true, id: 0 });
    const newLanguageDataChannel = RTCConnection.createDataChannel('language', { negotiated: true, id: 1 });

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

    setCodeDataChannels((prev) => [...prev, { id: socketId, dataChannel: newCodeDataChannel }]);
    setLanguageDataChannels((prev) => [...prev, { id: socketId, dataChannel: newLanguageDataChannel }]);

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

      socket.emit(RTC_SOCKET_EMIT_EVENT.OFFER, {
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

    socket.emit(RTC_SOCKET_EMIT_EVENT.ANSWER, {
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

    setCodeDataChannels((prev) => prev.filter(({ id }) => id !== data.id));
    setLanguageDataChannels((prev) => prev.filter(({ id }) => id !== data.id));

    setStreamList((prev) => prev.filter((stream) => stream.id !== data.id));
  };

  return { socket, streamList, codeDataChannels, languageDataChannels };
};

export default useRTCConnection;
