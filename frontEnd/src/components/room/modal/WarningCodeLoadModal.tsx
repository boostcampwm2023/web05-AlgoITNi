import useFocus from '@/hooks/useFocus';
import useModal from '@/hooks/useModal';

export default function WarningCodeLoadModal({ callback }: { callback: () => void }) {
  const { hide } = useModal();
  const ref = useFocus<HTMLButtonElement>();

  const handleClick = () => {
    hide();
    callback();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="pb-4 text-xl">
        <h2>작업중이던 내용이 모두 지워집니다.</h2>
      </div>
      <form className="absolute bottom-0 left-0 flex w-full border justify-evenly rounded-b-2xl">
        <button type="button" className="w-full py-2 text-xl border-r-2" onClick={hide}>
          취소
        </button>
        <button ref={ref} type="submit" className="w-full py-2 text-xl font-bold text-mainColor" onClick={handleClick}>
          확인
        </button>
      </form>
    </div>
  );
}
