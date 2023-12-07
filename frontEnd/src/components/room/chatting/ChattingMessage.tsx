import { MessageData } from '@/types/chatting';

interface ChattingMessageProps {
  messageData: MessageData;
  isMyMessage: boolean;
}

export default function ChattingMessage({ messageData, isMyMessage }: ChattingMessageProps) {
  const aiMessage = messageData.ai;
  const myMessage = !aiMessage && isMyMessage;

  const getMessageColor = () => {
    if (aiMessage) return 'bg-point-blue text-white';
    if (myMessage) return 'bg-blue-100';

    return 'bg-yellow-100';
  };

  return (
    <div className={`flex flex-col gap-0.5 ${myMessage ? 'items-end' : 'items-start'}`}>
      <span className="mx-1 text-xs font-light">{aiMessage ? '클로바 X' : messageData.nickname}</span>
      <div className={`px-4 py-2 rounded-lg w-fit ${getMessageColor()}`}>
        <span className="whitespace-pre-wrap">{messageData.message}</span>
      </div>
    </div>
  );
}
