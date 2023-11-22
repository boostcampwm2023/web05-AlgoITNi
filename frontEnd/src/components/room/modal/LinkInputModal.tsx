export default function LinkInputModal({ hide }: { hide: () => void }) {
  const handleOK = () => {
    hide();
  };

  return (
    <div className="flex flex-col justify-between h-full pb-4 font-Pretendard ">
      <input type="text" placeholder="URL을 입력해주세요" className="px-4 py-2 text-xl" />
      <div className="absolute bottom-0 left-0 flex w-full border justify-evenly rounded-b-2xl">
        <button type="button" className="w-full py-2 text-xl border-r-2" onClick={hide}>
          취소
        </button>
        <button type="button" className="w-full py-2 text-xl font-bold text-mainColor" onClick={handleOK}>
          확인
        </button>
      </div>
    </div>
  );
}
