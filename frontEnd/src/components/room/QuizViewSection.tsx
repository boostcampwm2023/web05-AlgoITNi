import useModal from '@/hooks/useModal';
import LinkInputModal from './modal/LinkInputModal';
import clickSrc from '@/assets/click.svg';

export default function QuizViewSection() {
  const { show, hide } = useModal(LinkInputModal);
  return (
    <button
      type="button"
      className="flex items-center justify-center w-full h-full text-white rounded-lg bg-mainColor font-Pretendard"
      onClick={() => show({ hide })}
    >
      <div className="flex gap-2">
        <img src={clickSrc} width="20px" alt="clickIcon" />
        <div>클릭해서 링크 입력하기</div>
      </div>
    </button>
  );
}
