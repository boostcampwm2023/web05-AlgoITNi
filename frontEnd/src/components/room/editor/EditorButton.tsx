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
      className="flex items-center w-[8vh] justify-center px-[max(2vh,25px)] h-full text-[max(1.2vh,10px)] bg-[#132A37] font-thin text-white rounded whitespace-nowrap"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
