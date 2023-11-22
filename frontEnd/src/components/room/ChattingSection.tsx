import { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client/debug';
import { VITE_CHAT_URL } from '@/constants/env';

interface SocketMessage {
  message: string;
}

let socket: Socket;

export default function ChattingSection({ roomId }: { roomId: string }) {
  const [message, setMessage] = useState('');
  const [allMessages, setAllMessage] = useState<SocketMessage[]>([]);

  useEffect(() => {
    socket = io(VITE_CHAT_URL, {
      transports: ['websocket'],
    });
    socket.on('new_message', (recievedMessage) => {
      setAllMessage((prev) => [...prev, JSON.parse(recievedMessage)]);
    });
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
    <div className="relative p-2 flex items-center justify-center w-full h-full rounded-lg bg-primary min-w-[150px]">
      <div className="flex flex-col w-full h-full gap-2 px-2">
        {allMessages.map((messageData, index) => (
          <div key={index} className="flex flex-col gap-0.5">
            <span className="text-xs font-light text-white">보낸사람</span>
            <div className="px-4 py-2 bg-white rounded-lg w-fit">
              <span>{messageData.message}</span>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleMessageSend} className="absolute bottom-0 w-full p-2 rounded-b-lg bg-primary">
        <div className="flex items-center h-10 border rounded-lg border-base">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full h-10 p-2 rounded-s-lg focus:outline-none"
          />
          <button type="submit" className="h-full px-4 py-1 font-light text-white rounded-e-lg whitespace-nowrap bg-secondary">
            전송
          </button>
        </div>
      </form>
    </div>
  );
}
