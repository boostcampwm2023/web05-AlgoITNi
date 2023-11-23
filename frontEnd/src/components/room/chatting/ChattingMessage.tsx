import { MessageData } from '@/types/chatting';

export default function ChattingMessage({ messageData }: { messageData: MessageData }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-light text-white">보낸사람</span>
      <div className="px-4 py-2 bg-white rounded-lg w-fit">
        <span>{messageData.message}</span>
      </div>
    </div>
  );
}
