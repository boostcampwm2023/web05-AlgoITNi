import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Socket } from 'socket.io-client/debug';
import Spinner from '@/components/common/Spinner';
import ToggleAi from '@/components/common/ToggleAi';
import { CHATTING_SOCKET_EMIT_EVNET } from '@/constants/chattingSocketEvents';
import useInput from '@/hooks/useInput';
import useRoomConfigData from '@/stores/useRoomConfigData';

function SendButtonText({ usingAi, postingAi }: { usingAi: boolean; postingAi: boolean }) {
  if (!usingAi) return '전송';
  if (postingAi) return <Spinner />;

  return '질문';
}

interface ChattingInputProps {
  usingAi: boolean;
  setUsingAi: React.Dispatch<React.SetStateAction<boolean>>;
  postingAi: boolean;
  setPostingAi: React.Dispatch<React.SetStateAction<boolean>>;
  socket: Socket | null;
  moveToBottom: () => void;
}

export default function ChattingInput({ usingAi, setUsingAi, postingAi, setPostingAi, socket, moveToBottom }: ChattingInputProps) {
  const { inputValue: message, onChange, resetInput } = useInput<HTMLTextAreaElement>('');
  const [prevKey, setPrevKey] = useState<string>('');
  const nickname = useRoomConfigData((state) => state.nickname);
  const { roomId } = useParams();

  const handleMessageSend = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!socket) return;

    if (usingAi) {
      setPostingAi(true);

      socket.emit(CHATTING_SOCKET_EMIT_EVNET.SEND_MESSAGE, { room: roomId, message, nickname: `${nickname}의 질문`, ai: false });
      socket.emit(CHATTING_SOCKET_EMIT_EVNET.SEND_MESSAGE, { room: roomId, message, nickname, ai: true });
    } else socket.emit(CHATTING_SOCKET_EMIT_EVNET.SEND_MESSAGE, { room: roomId, message, nickname, ai: false });

    resetInput();
    moveToBottom();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      if (prevKey !== 'Shift' && !event.nativeEvent.isComposing) {
        event.preventDefault();
        handleMessageSend(event as unknown as React.FormEvent<HTMLFormElement>);
      }
    }

    setPrevKey(event.key);
  };

  return (
    <form onSubmit={handleMessageSend} className="w-full p-2 rounded-b-lg bg-base">
      <ToggleAi usingAi={usingAi} setUsingAi={setUsingAi} />
      <div className="flex items-center w-full h-[72px] rounded-lg drop-shadow-lg">
        <textarea
          onKeyDown={handleKeyDown}
          disabled={usingAi && postingAi}
          value={message}
          onChange={onChange}
          className={`w-full h-full p-2 px-4 focus:outline-none rounded-s-lg resize-none border-2 custom-scroll ${
            usingAi ? 'border-point-blue' : 'border-white'
          }`}
          placeholder={usingAi ? 'AI에게 질문해보세요' : 'Message'}
        />
        <button
          type="submit"
          className={`font-normal rounded-e-lg whitespace-nowrap w-16 flex items-center justify-center h-full ${
            usingAi ? 'bg-point-blue text-white' : 'bg-primary text-black'
          }`}
          disabled={usingAi && postingAi}
        >
          <SendButtonText usingAi={usingAi} postingAi={postingAi} />
        </button>
      </div>
    </form>
  );
}
