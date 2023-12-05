import { useEffect, useRef, useState } from 'react';
import { Socket, io } from 'socket.io-client/debug';
import { VITE_CHAT_URL } from '@/constants/env';
import { ErrorData, ErrorResponse, MessageData } from '@/types/chatting';
import ChattingMessage from './chatting/ChattingMessage';
import useLastMessageViewingState from '@/hooks/useLastMessageViewingState';
import ChattingInput from './chatting/ChattingInput';
import ScrollDownButton from './chatting/ScrollDownButton';
import { CHATTING_SOCKET_EMIT_EVNET, CHATTING_SOCKET_RECIEVE_EVNET } from '@/constants/chattingSocketEvents';
import Section from '../common/SectionWrapper';
import { CHATTING_ERROR_STATUS_CODE, CHATTING_ERROR_TEXT } from '@/constants/chattingErrorResponse';
import ChattingErrorToast from '../common/ChattingErrorToast';

interface ChattingSectionProps {
  roomId: string;
  nickname: string;
}

let socket: Socket;
let timer: NodeJS.Timeout | null;

export default function ChattingSection({ roomId, nickname }: ChattingSectionProps) {
  const [message, setMessage] = useState('');
  const [allMessages, setAllMessage] = useState<MessageData[]>([]);
  const [usingAi, setUsingAi] = useState<boolean>(false);
  const [postingAi, setPostingAi] = useState<boolean>(false);
  const [errorData, setErrorData] = useState<ErrorData | null>(null);

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

    if (!socket) return;

    if (usingAi) {
      setPostingAi(true);
      socket.emit(CHATTING_SOCKET_EMIT_EVNET.SEND_MESSAGE, { room: roomId, message, nickname, ai: true });
    } else socket.emit(CHATTING_SOCKET_EMIT_EVNET.SEND_MESSAGE, { room: roomId, message, nickname, ai: false });

    setMessage('');
    setScrollRatio(100);
  };

  const handleRecieveMessage = (recievedMessage: string) => {
    const newMessage: MessageData | { using: boolean } = JSON.parse(recievedMessage);

    // 새로운 메시지가 AI 사용 여부에 관한 메시지인 경우
    if ('using' in newMessage) {
      setPostingAi(newMessage.using);
      return;
    }

    // 새로운 메시지가 일반적인 채팅 메시지인 경우
    if (newMessage.ai) setPostingAi(false); // AI의 메시지인 경우

    setAllMessage((prev) => [...prev, newMessage]);
  };

  const handleChattingSocketError = (errorMessage: string) => {
    const errorResponse: ErrorResponse = JSON.parse(errorMessage);
    const { statusCode } = errorResponse;

    const { MESSAGE_ERROR_CODE, SERVER_ERROR_CODE, AI_ERROR_CODE } = CHATTING_ERROR_STATUS_CODE;
    const { MESSAGE_ERROR_TEXT, SERVER_ERROR_TEXT, AI_ERROR_TEXT } = CHATTING_ERROR_TEXT;

    if (statusCode === MESSAGE_ERROR_CODE) setErrorData(MESSAGE_ERROR_TEXT);
    if (statusCode === SERVER_ERROR_CODE) setErrorData(SERVER_ERROR_TEXT);
    if (statusCode === AI_ERROR_CODE) setErrorData(AI_ERROR_TEXT);
  };

  useEffect(() => {
    socket = io(VITE_CHAT_URL, {
      transports: ['websocket'],
    });

    socket.on(CHATTING_SOCKET_RECIEVE_EVNET.NEW_MESSAGE, handleRecieveMessage);
    socket.on('error', handleChattingSocketError);
    socket.connect();

    socket.emit(CHATTING_SOCKET_EMIT_EVNET.JOIN_ROOM, { room: roomId });
  }, []);

  useEffect(() => {
    if (isViewingLastMessage) moveToBottom(messageAreaRef);
    else setIsRecievedMessage(true);
  }, [allMessages]);

  return (
    <Section>
      <div className="flex relative flex-col items-center justify-center w-full pt-2 h-full rounded-lg bg-primary min-w-[150px]">
        <div
          ref={messageAreaRef}
          className="flex flex-col w-full h-full gap-2 px-2 py-2 pl-4 mr-4 overflow-auto grow custom-scroll"
          onScroll={handleScroll}
        >
          {allMessages.map((messageData, index) => (
            <ChattingMessage messageData={messageData} key={index} isMyMessage={messageData.socketId === socket.id} />
          ))}
        </div>
        {isRecievedMessage && <ScrollDownButton handleMoveToBottom={handleMoveToBottom} />}
        {errorData && <ChattingErrorToast errorData={errorData} setErrorData={setErrorData} />}
        <ChattingInput
          handleMessageSend={handleMessageSend}
          message={message}
          handleInputMessage={handleInputMessage}
          usingAi={usingAi}
          setUsingAi={setUsingAi}
          postingAi={postingAi}
        />
      </div>
    </Section>
  );
}
