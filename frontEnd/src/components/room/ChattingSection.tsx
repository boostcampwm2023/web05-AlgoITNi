import { useParams } from 'react-router-dom';
import { memo, useEffect, useState } from 'react';
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
import useScroll from '@/hooks/useScroll';

function ChattingSection() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [allMessages, setAllMessage] = useState<MessageData[]>([]);

  const [usingAi, setUsingAi] = useState<boolean>(false);
  const [postingAi, setPostingAi] = useState<boolean>(false);

  const [errorData, setErrorData] = useState<ErrorData | null>(null);
  const { roomId } = useParams();

  const { ref: messageAreaRef, scrollRatio, handleScroll, moveToBottom } = useScroll<HTMLDivElement>();
  const { isViewingLastMessage, isRecievedMessage, setIsRecievedMessage } = useLastMessageViewingState(scrollRatio);

  const handleRecieveMessage = (recievedMessage: MessageData | { using: boolean }) => {
    const remoteUsingAi = 'using' in recievedMessage;

    if (remoteUsingAi) {
      setPostingAi(recievedMessage.using);
      return;
    }

    // 새로운 메시지가 일반적인 채팅 메시지인 경우
    if (recievedMessage.ai) setPostingAi(false); // AI의 메시지인 경우

    setAllMessage((prev) => [...prev, recievedMessage]);
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
    setSocket(() => {
      const newSocket = io(VITE_CHAT_URL, {
        transports: ['websocket'],
      });

      newSocket.on(CHATTING_SOCKET_RECIEVE_EVNET.NEW_MESSAGE, handleRecieveMessage);
      newSocket.on('exception', handleChattingSocketError);
      newSocket.connect();

      newSocket.emit(CHATTING_SOCKET_EMIT_EVNET.JOIN_ROOM, { room: roomId });

      return newSocket;
    });
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
            <ChattingMessage messageData={messageData} key={index} isMyMessage={messageData.socketId === socket?.id} />
          ))}
        </div>
        {isRecievedMessage && <ScrollDownButton handleMoveToBottom={moveToBottom} />}
        {errorData && <ChattingErrorToast errorData={errorData} setErrorData={setErrorData} />}
        <ChattingInput
          usingAi={usingAi}
          setUsingAi={setUsingAi}
          postingAi={postingAi}
          socket={socket}
          setPostingAi={setPostingAi}
          moveToBottom={moveToBottom}
        />
      </div>
    </Section>
  );
}

export default memo(ChattingSection);
