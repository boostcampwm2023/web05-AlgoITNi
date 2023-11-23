import { useEffect, useRef, useState } from 'react';
import { Socket, io } from 'socket.io-client/debug';
import { VITE_CHAT_URL } from '@/constants/env';
import { MessageData } from '@/types/chatting';
import ChattingMessage from './chatting/ChattingMessage';
import useScroll from '@/hooks/useScroll';
import ChattingInput from './chatting/ChattingInput';
import ScrollDownButton from './chatting/ScrollDownButton';

let socket: Socket;

export default function ChattingSection({ roomId }: { roomId: string }) {
  const [message, setMessage] = useState('');
  const [allMessages, setAllMessage] = useState<MessageData[]>([]);
  const { setIsRecievedMessage, setScrollRatio, isRecievedMessage, isLastMessageView } = useScroll();

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

  const handleInputMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleMessageSend = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (socket) {
      socket.emit('send_message', { room: roomId, message });
      setMessage('');
    }
  };

  return (
    <div className="flex relative flex-col items-center justify-center w-full h-full rounded-lg bg-primary min-w-[150px]">
      <div ref={messageAreaRef} className="flex flex-col w-full h-full gap-2 px-2 pt-2 overflow-auto grow" onScroll={handleScroll}>
        {allMessages.map((messageData, index) => (
          <ChattingMessage messageData={messageData} key={index} />
        ))}
      </div>
      {isRecievedMessage && <ScrollDownButton handleMoveToBottom={handleMoveToBottom} />}
      <ChattingInput handleMessageSend={handleMessageSend} message={message} handleInputMessage={handleInputMessage} />
    </div>
  );
}
