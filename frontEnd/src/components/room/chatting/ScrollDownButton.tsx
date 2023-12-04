interface ScrollDownButtonProps {
  handleMoveToBottom: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function ScrollDownButton({ handleMoveToBottom }: ScrollDownButtonProps) {
  return (
    <button
      type="button"
      onClick={handleMoveToBottom}
      className="absolute z-10 w-8 h-8 text-xs rounded-full bg-secondary right-8 bottom-16"
    >
      ↓
    </button>
  );
}
