import useModal from '@/hooks/useModal';
import LinkInputModal from './modal/LinkInputModal';

export default function QuizViewSection() {
  const { show, hide } = useModal(LinkInputModal);
  return (
    <button
      type="button"
      className="flex items-center justify-center w-full h-full text-white rounded-lg bg-mainColor font-Pretendard"
      onClick={() => show({ hide })}
    >
      <div>링크를 입력해주세요</div>
    </button>
  );
}
