import { useEffect, useRef, useState } from 'react';
import { Socket, io } from 'socket.io-client/debug';
import { VITE_CHAT_URL } from '@/constants/env';
import { MessageData } from '@/types/chatting';
import ChattingMessage from './chatting/ChattingMessage';
import useLastMessageViewingState from '@/hooks/useLastMessageViewingState';
import ChattingInput from './chatting/ChattingInput';
import ScrollDownButton from './chatting/ScrollDownButton';

let socket: Socket;
let timer: NodeJS.Timeout | null;

export default function ChattingSection({ roomId }: { roomId: string }) {
  const [message, setMessage] = useState('');
  const [allMessages, setAllMessage] = useState<MessageData[]>([]);
  const { isViewingLastMessage, isRecievedMessage, setScrollRatio, setIsRecievedMessage } = useLastMessageViewingState();

  const messageAreaRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = () => {
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;

        if (!messageAreaRef.current) return;

        const { scrollTop, clientHeight, scrollHeight } = messageAreaRef.current;
        setScrollRatio(((scrollTop + clientHeight) / scrollHeight) * 100);
      }, 200);
    }
  };

  const moveToBottom = (ref: React.RefObject<HTMLElement>) => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  };

  const handleMoveToBottom = () => {
    moveToBottom(messageAreaRef);
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
      setScrollRatio(100);
    }
  };

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
    if (isViewingLastMessage) moveToBottom(messageAreaRef);
    else setIsRecievedMessage(true);
  }, [allMessages]);

  return (
    <div className="flex relative flex-col items-center justify-center w-full pt-2 h-full rounded-lg bg-primary min-w-[150px]">
      <div
        ref={messageAreaRef}
        className="flex flex-col w-full h-full gap-2 px-2 pt-2 pl-4 mr-4 overflow-auto grow custom-scroll"
        onScroll={handleScroll}
      >
        {allMessages.map((messageData, index) => (
          <ChattingMessage messageData={messageData} key={index} />
        ))}
      </div>
      {isRecievedMessage && <ScrollDownButton handleMoveToBottom={handleMoveToBottom} />}
      <ChattingInput handleMessageSend={handleMessageSend} message={message} handleInputMessage={handleInputMessage} />
    </div>
  );
}
