export default function EditorButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className="flex items-center justify-center w-24 h-full px-4 text-sm text-black rounded shadow drop-shadow-lg whitespace-nowrap bg-base"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
