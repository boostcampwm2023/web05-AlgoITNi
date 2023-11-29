import Button from '@/components/common/Button';
import SaveModal from './SaveModal';
import useModal from '@/hooks/useModal';
import SuccessModal from './SuccessModal';
import useModifyState from '@/stores/useModifyState';
import patchUserCode from '@/apis/putUserCode';
import { Language } from '@/types/editor';
import { EDITOR_LANGUAGE_TYPES } from '@/constants/editor';

export default function SaveChoiceModal({
  code,
  language,
  fileName,
  setFileName,
}: {
  code: string;
  language: Language;
  fileName: string;
  setFileName: (value: React.SetStateAction<string>) => void;
}) {
  const { hide } = useModal();
  const { show: showSaveModal } = useModal(SaveModal);
  const { show: showSuccessModal } = useModal(SuccessModal);
  const { modifyId } = useModifyState();

  const handleModifyClick = async () => {
    const [name] = fileName.split('.');

    hide();
    await patchUserCode(modifyId, `${name}.${EDITOR_LANGUAGE_TYPES[language].extension}`, code, language);
    setFileName(`${name}.${EDITOR_LANGUAGE_TYPES[language].extension}`);
    showSuccessModal();
  };
  const handleNewFileClick = () => {
    hide();
    showSaveModal({ code, language, setFileName });
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
