interface ScrollDownButtonProps {
  handleMoveToBottom: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function ScrollDownButton({ handleMoveToBottom }: ScrollDownButtonProps) {
  return (
    <button
      type="button"
      onClick={handleMoveToBottom}
      className="absolute z-10 h-8 text-xs text-white rounded-full w-28 bg-point-red right-7 bottom-28 animate-bounce"
    >
      새로운 메시지 ↓
    </button>
  );
}
