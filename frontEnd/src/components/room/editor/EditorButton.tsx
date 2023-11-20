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
      className="flex items-center justify-center px-4 py-2 text-[1.3vh] bg-[#132A37] font-thin text-white rounded whitespace-nowrap"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
