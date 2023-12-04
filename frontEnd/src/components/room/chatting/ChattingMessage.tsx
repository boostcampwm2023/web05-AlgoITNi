import { MessageData } from '@/types/chatting';

interface ChattingMessageProps {
  messageData: MessageData;
  isMyMessage: boolean;
}

export default function ChattingMessage({ messageData, isMyMessage }: ChattingMessageProps) {
  return (
    <div className={`flex flex-col gap-0.5 ${isMyMessage ? 'items-end' : 'items-start'}`}>
      <span className="mx-1 text-xs font-light ">{messageData.nickname}</span>
      <div className={`px-4 py-2 rounded-lg w-fit ${isMyMessage ? 'bg-blue-100' : 'bg-yellow-100'}`}>
        <span>{messageData.message}</span>
      </div>
    </div>
  );
}
