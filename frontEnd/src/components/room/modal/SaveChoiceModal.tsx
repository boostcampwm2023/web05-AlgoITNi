import Button from '@/components/common/Button';
import SaveModal from './SaveModal';
import useModal from '@/hooks/useModal';
import SuccessModal from './SuccessModal';
import useModifyState from '@/stores/useModifyState';
import patchUserCode from '@/apis/putUserCode';

export default function SaveChoiceModal({ code }: { code: string }) {
  const { hide } = useModal();
  const { show: showSaveModal } = useModal(SaveModal);
  const { show: showSuccessModal } = useModal(SuccessModal);
  const { modifyId } = useModifyState();

  const handleModifyClick = async () => {
    hide();
    // TODO: 파일제목, 파일 타입 추가하기
    await patchUserCode(modifyId, 'solution.py', code, 'python');
    showSuccessModal();
  };
  const handleNewFileClick = () => {
    hide();
    showSaveModal({ code });
  };
  return (
    <div className="flex flex-col gap-4 px-11">
      <div className="text-xl font-bold">어떻게 저장할까요?</div>
      <div className="flex flex-col gap-2">
        <Button.Default onClick={handleModifyClick} fontSize="1vw">
          기존 파일 수정하기
        </Button.Default>
        <Button.White onClick={handleNewFileClick} fontSize="1vw">
          새파일로 저장하기
        </Button.White>
      </div>
    </div>
  );
}
