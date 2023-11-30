import { MessageData } from '@/types/chatting';

interface ChattingMessageProps {
  messageData: MessageData;
  isMyMessage: boolean;
}

export default function ChattingMessage({ messageData, isMyMessage }: ChattingMessageProps) {
  return (
    <div className={`flex flex-col gap-0.5 ${isMyMessage ? 'items-end' : 'items-start'}`}>
      <span className="mx-1 text-xs font-light text-white">{messageData.nickname}</span>
      <div className={`px-4 py-2 rounded-lg w-fit ${isMyMessage ? 'bg-blue-200' : 'bg-white'}`}>
        <span>{messageData.message}</span>
      </div>
    </div>
  );
}
