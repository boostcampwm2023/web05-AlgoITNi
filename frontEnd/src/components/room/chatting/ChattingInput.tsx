import Spinner from '@/components/common/Spinner';
import ToggleAi from '@/components/common/ToggleAi';

function SendButtonText({ usingAi, postingAi }: { usingAi: boolean; postingAi: boolean }) {
  if (!usingAi) return '전송';
  if (postingAi) return <Spinner />;

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
  return (
    <form onSubmit={handleMessageSend} className="w-full p-2 rounded-b-lg bg-base">
      <ToggleAi usingAi={usingAi} setUsingAi={setUsingAi} />
      <div className="flex items-center w-full h-12 rounded-lg drop-shadow-lg">
        <input
          disabled={usingAi && postingAi}
          type="text"
          value={message}
          onChange={handleInputMessage}
          className={`w-full h-12 p-2 px-4 focus:outline-none rounded-s-lg ${usingAi ? 'border-point-blue border-2' : ''}`}
          placeholder={usingAi ? 'AI에게 질문해보세요' : 'Message'}
        />
        <button
          type="submit"
          className={`h-full px-4 py-1 font-normal rounded-e-lg whitespace-nowrap w-16 flex items-center justify-center ${
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
