export default function EditorButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      type="button"
      className="flex items-center min-w-[8vh] justify-center px-[max(2vh,25px)] h-full text-sm   drop-shadow-lg rounded whitespace-nowrap shadow bg-base text-black"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
