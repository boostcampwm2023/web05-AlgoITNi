function SaveButtonElement({ children, onClick }: { children: React.ReactNode; onClick: React.MouseEventHandler<HTMLButtonElement> }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center w-32 px-4 py-2 text-sm text-white duration-300 rounded-lg hover:text-black hover:bg-backgroundColor whitespace-nowrap"
    >
      {children}
    </button>
  );
}

export default function SaveButton({
  handleSaveLocal,
  handleSaveCloud,
}: {
  handleSaveLocal: React.MouseEventHandler<HTMLButtonElement>;
  handleSaveCloud: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <div className="relative">
      <div className="peer flex items-center justify-center px-4 py-2 text-[1.3vh] bg-[#132A37] font-thin text-white rounded whitespace-nowrap">
        저장하기
      </div>
      <div className="absolute z-10 items-center justify-between hidden gap-2 p-2 -translate-x-1/2 rounded-lg bg-[#132A37] left-1/2 -top-12 peer-hover:flex hover:flex">
        <SaveButtonElement onClick={handleSaveLocal}>로컬에 저장</SaveButtonElement>
        <SaveButtonElement onClick={handleSaveCloud}>클라우드에 저장</SaveButtonElement>
      </div>
    </div>
  );
}
