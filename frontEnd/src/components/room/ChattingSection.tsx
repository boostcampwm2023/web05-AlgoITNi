import { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client/debug';
import { VITE_CHAT_URL } from '@/constants/env';

let socket: Socket;

export default function ChattingSection({ roomId }: { roomId: string }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    socket = io(VITE_CHAT_URL, {
      transports: ['websocket'],
    });
    socket.on('new_message', (recievedMessage) => console.log(recievedMessage));
    socket.connect();

    socket.emit('join_room', { room: roomId });
  }, []);

  const handleMessageSend = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (socket) {
      socket.emit('send_message', { room: roomId, message });
      setMessage('');
    }
  };

  return (
    <div className="relative flex items-center justify-center w-full h-full rounded-lg bg-primary font-Pretendard">
      <form onSubmit={handleMessageSend} className="absolute bottom-0 w-full p-2 bg-red-300 rounded-b-lg">
        <div className="relative">
          <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} className="w-full h-10 p-2 rounded-lg" />
          <button type="submit" className="absolute top-0 right-0 p-2 font-thin text-white rounded-lg bg-mainColor">
            전송
          </button>
        </div>
      </form>
    </div>
  );
}
