import { MessageData } from '@/types/chatting';

interface ChattingMessageProps {
  messageData: MessageData;
  myMessage: boolean;
}

export default function ChattingMessage({ messageData, myMessage }: ChattingMessageProps) {
  return (
    <div className={`flex flex-col gap-0.5 ${myMessage ? 'items-end' : ''}`}>
      <span className="text-xs font-light text-white">{myMessage ? '나' : messageData.nickname}</span>
      <div className={`px-4 py-2 rounded-lg w-fit ${myMessage ? 'bg-blue-200' : 'bg-white'}`}>
        <span>{messageData.message}</span>
      </div>
    </div>
  );
}
