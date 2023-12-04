import aiIcon from '@/assets/ai.svg';
import Spinner from '@/components/common/Spinner';

function SendButtonText({ usingAi, postingAi }: { usingAi: boolean; postingAi: boolean }) {
  if (!usingAi) return '전송';

  if (postingAi) return <Spinner size={7} width={4} />;
  return '질문';
}

interface ChattingInputProps {
  handleMessageSend: (event: React.FormEvent<HTMLFormElement>) => void;
  message: string;
  handleInputMessage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  usingAi: boolean;
  setUsingAi: React.Dispatch<React.SetStateAction<boolean>>;
  postingAi: boolean;
}

export default function ChattingInput({
  handleMessageSend,
  message,
  handleInputMessage,
  usingAi,
  setUsingAi,
  postingAi,
}: ChattingInputProps) {
  const handleChangeMessageType = () => {
    setUsingAi((prev) => !prev);
  };

  return (
    <form onSubmit={handleMessageSend} className="w-full p-2 rounded-b-lg bg-primary">
      <div className="flex items-center h-10 border rounded-lg border-base">
        <button onClick={handleChangeMessageType} type="button" className="min-w-[40px] h-full ml-2 p-1 bg-transparent">
          <img src={aiIcon} alt="AI 아이콘" />
        </button>
        <input
          disabled={usingAi && postingAi}
          type="text"
          value={message}
          onChange={handleInputMessage}
          className="w-full h-10 p-2 rounded-s-lg focus:outline-none"
        />
        <button
          type="submit"
          className={`h-full px-4 py-1 font-light text-white rounded-e-lg whitespace-nowrap w-16 flex items-center justify-center ${
            usingAi ? 'bg-[#347DFF]' : 'bg-secondary'
          }`}
          disabled={usingAi && postingAi}
        >
          <SendButtonText usingAi={usingAi} postingAi={postingAi} />
        </button>
      </div>
    </form>
  );
}
