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
  handleInputMessage: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
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
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleMessageSend(event as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  return (
    <form onSubmit={handleMessageSend} className="w-full p-2 rounded-b-lg bg-base">
      <ToggleAi usingAi={usingAi} setUsingAi={setUsingAi} />
      <div className="flex items-center w-full h-[72px] rounded-lg drop-shadow-lg">
        <textarea
          onKeyDown={handleKeyDown}
          disabled={usingAi && postingAi}
          value={message}
          onChange={handleInputMessage}
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
