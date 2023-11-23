interface ChattingInputProps {
  handleMessageSend: (event: React.FormEvent<HTMLFormElement>) => void;
  message: string;
  handleInputMessage: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ChattingInput({ handleMessageSend, message, handleInputMessage }: ChattingInputProps) {
  return (
    <form onSubmit={handleMessageSend} className="w-full p-2 rounded-b-lg bg-primary">
      <div className="flex items-center h-10 border rounded-lg border-base">
        <input type="text" value={message} onChange={handleInputMessage} className="w-full h-10 p-2 rounded-s-lg focus:outline-none" />
        <button type="submit" className="h-full px-4 py-1 font-light text-white rounded-e-lg whitespace-nowrap bg-secondary">
          전송
        </button>
      </div>
    </form>
  );
}
