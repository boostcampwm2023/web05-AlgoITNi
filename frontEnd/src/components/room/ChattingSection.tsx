import { useEffect, useRef, useState } from 'react';
import { Socket, io } from 'socket.io-client/debug';
import { VITE_CHAT_URL } from '@/constants/env';

interface SocketMessage {
  message: string;
}

let socket: Socket;

export default function ChattingSection({ roomId }: { roomId: string }) {
  const [message, setMessage] = useState('');
  const [allMessages, setAllMessage] = useState<SocketMessage[]>([]);

  const [scrollRatio, setScrollRatio] = useState(100);
  const [isLastMessageView, setIsLastMessageView] = useState(true);
  const [isRecievedMessage, setIsRecievedMessage] = useState(false);

  const messageAreaRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    if (isLastMessageView) messageAreaRef.current!.scrollTop = messageAreaRef.current!.scrollHeight;
    else setIsRecievedMessage(true);
  }, [allMessages]);

  useEffect(() => {
    if (scrollRatio >= 95) {
      setIsLastMessageView(true);
      setIsRecievedMessage(false);
    } else setIsLastMessageView(false);
  }, [scrollRatio]);

  const handleScroll = () => {
    // TODO: 쓰로틀링 걸기
    if (!messageAreaRef.current) return;
    const { scrollTop, clientHeight, scrollHeight } = messageAreaRef.current;

    setScrollRatio(((scrollTop + clientHeight) / scrollHeight) * 100);
  };

  const handleMoveToBottom = () => {
    messageAreaRef.current!.scrollTop = messageAreaRef.current!.scrollHeight;
    setScrollRatio(100);
  };

  const handleMessageSend = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (socket) {
      socket.emit('send_message', { room: roomId, message });
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col p-2 items-center justify-center w-full h-full rounded-lg bg-primary min-w-[150px]">
      <div ref={messageAreaRef} className="flex flex-col w-full h-full gap-2 px-2 overflow-auto grow" onScroll={handleScroll}>
        {allMessages.map((messageData, index) => (
          <div key={index} className="flex flex-col gap-0.5">
            <span className="text-xs font-light text-white">보낸사람</span>
            <div className="px-4 py-2 bg-white rounded-lg w-fit">
              <span>{messageData.message}</span>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleMessageSend} className="relative w-full p-2 rounded-b-lg bg-primary">
        {isRecievedMessage && (
          <button
            type="button"
            onClick={handleMoveToBottom}
            className="absolute z-10 w-8 h-8 text-xs text-white rounded-full bg-secondary right-8 -top-10"
          >
            ↓
          </button>
        )}
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
