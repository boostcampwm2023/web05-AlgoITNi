import aiIcon from '@/assets/ai.svg';

interface ChattingInputProps {
  handleMessageSend: (event: React.FormEvent<HTMLFormElement>) => void;
  message: string;
  handleInputMessage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  usingAi: boolean;
  setUsingAi: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ChattingInput({ handleMessageSend, message, handleInputMessage, usingAi, setUsingAi }: ChattingInputProps) {
  const handleChangeMessageType = () => {
    setUsingAi((prev) => !prev);
  };

  return (
    <form onSubmit={handleMessageSend} className="w-full p-2 rounded-b-lg bg-primary">
      <div className="flex items-center h-10 border rounded-lg border-base">
        <button onClick={handleChangeMessageType} type="button" className="w-10 h-10 ml-2 bg-transparent">
          <img src={aiIcon} alt="AI 아이콘" />
        </button>
        <input type="text" value={message} onChange={handleInputMessage} className="w-full h-10 p-2 border rounded-s-lg focus:outline-none" />
        <button type="submit" className="h-full px-4 py-1 font-light text-white rounded-e-lg whitespace-nowrap bg-secondary">
          전송
        </button>
      </div>
    </form>
  );
}
