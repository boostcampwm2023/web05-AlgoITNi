import { useEffect } from 'react';
import { Socket, io } from 'socket.io-client/debug';
import { VITE_CHAT_URL } from '@/constants/env';

let socket: Socket;

export default function ChattingSection({ roomId }: { roomId: string }) {
  useEffect(() => {
    socket = io(VITE_CHAT_URL, {
      transports: ['websocket'],
    });
    socket.on('new_message', (message) => console.log(message));
    socket.connect();

    socket.emit('join_room', { room: roomId });
    if (socket) socket.emit('send_message', { room: roomId, message: 'test!!!!' });
  }, []);

  return <div className="flex items-center justify-center w-full h-full text-white rounded-lg bg-mainColor font-Pretendard">채팅블록</div>;
}
