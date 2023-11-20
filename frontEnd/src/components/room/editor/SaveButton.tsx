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

export default function SaveButton({ plainCode }: { plainCode: string }) {
  const handleSaveLocal = () => {
    const element = document.createElement('a');
    const file = new Blob([plainCode], { type: 'text/plain' });
    const fileURL = URL.createObjectURL(file);

    element.href = fileURL;
    element.download = 'solution.py';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
    URL.revokeObjectURL(fileURL);
  };

  // TODO: 클라우드 저장 로직 추가
  const handleSaveCloud = () => {};

  return (
    <div className="relative h-full">
      <div className="peer flex items-center w-[8vh] justify-center px-[max(2vh,25px)] h-full text-[max(1.2vh,10px)] bg-[#132A37] font-thin text-white rounded whitespace-nowrap">
        저장하기
      </div>
      <div className="absolute z-10 items-center justify-between hidden gap-2 p-2 -translate-x-1/2 rounded-lg bg-[#132A37] left-1/2 -top-12 peer-hover:flex hover:flex">
        <SaveButtonElement onClick={handleSaveLocal}>로컬에 저장</SaveButtonElement>
        <SaveButtonElement onClick={handleSaveCloud}>클라우드에 저장</SaveButtonElement>
      </div>
    </div>
  );
}
