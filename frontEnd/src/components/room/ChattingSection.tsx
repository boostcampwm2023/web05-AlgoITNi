import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
import useRoomConfigData from '@/stores/useRoomConfigData';
import useInput from '@/hooks/useInput';
import useScroll from '@/hooks/useScroll';

let socket: Socket;

export default function ChattingSection() {
  const { inputValue: message, onChange, resetInput } = useInput('');
  const [allMessages, setAllMessage] = useState<MessageData[]>([]);
  const [usingAi, setUsingAi] = useState<boolean>(false);
  const [postingAi, setPostingAi] = useState<boolean>(false);
  const [errorData, setErrorData] = useState<ErrorData | null>(null);
  const { roomId } = useParams();

  const nickname = useRoomConfigData((state) => state.nickname);

  const { ref: messageAreaRef, scrollRatio, handleScroll, moveToBottom } = useScroll<HTMLDivElement>();
  const { isViewingLastMessage, isRecievedMessage, setIsRecievedMessage } = useLastMessageViewingState(scrollRatio);

  const handleMessageSend = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!socket) return;

    if (usingAi) {
      setPostingAi(true);
      socket.emit(CHATTING_SOCKET_EMIT_EVNET.SEND_MESSAGE, { room: roomId, message, nickname, ai: true });
    } else socket.emit(CHATTING_SOCKET_EMIT_EVNET.SEND_MESSAGE, { room: roomId, message, nickname, ai: false });

    resetInput();
    moveToBottom();
  };

  const handleRecieveMessage = (recievedMessage: string) => {
    const newMessage: MessageData | { using: boolean } = JSON.parse(recievedMessage);
    const remoteUsingAi = 'using' in newMessage;

    if (remoteUsingAi) {
      setPostingAi(newMessage.using);
      return;
    }

    // 새로운 메시지가 일반적인 채팅 메시지인 경우
    if (newMessage.ai) setPostingAi(false); // AI의 메시지인 경우

    setAllMessage((prev) => [...prev, newMessage]);
  };

  const handleChattingSocketError = (errorMessage: ErrorResponse) => {
    const { statusCode } = errorMessage;

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
    socket.on('exception', handleChattingSocketError);
    socket.connect();

    socket.emit(CHATTING_SOCKET_EMIT_EVNET.JOIN_ROOM, { room: roomId });
  }, []);

  useEffect(() => {
    if (isViewingLastMessage) moveToBottom();
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
        {isRecievedMessage && <ScrollDownButton handleMoveToBottom={moveToBottom} />}
        {errorData && <ChattingErrorToast errorData={errorData} setErrorData={setErrorData} />}
        <ChattingInput
          handleMessageSend={handleMessageSend}
          message={message}
          handleInputMessage={onChange}
          usingAi={usingAi}
          setUsingAi={setUsingAi}
          postingAi={postingAi}
        />
      </div>
    </Section>
  );
}
