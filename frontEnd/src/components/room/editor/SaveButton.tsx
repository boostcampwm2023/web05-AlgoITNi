import useModal from '@/hooks/useModal';
import { downloadLocalFile } from '@/utils/file';
import SaveModal from '../modal/SaveModal';
import useModifyState from '@/stores/useModifyState';
import SaveChoiceModal from '../modal/SaveChoiceModal';
import { LanguageInfo } from '@/types/editor';

function SaveButtonElement({ children, onClick }: { children: React.ReactNode; onClick: React.MouseEventHandler<HTMLButtonElement> }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center w-32 px-4 py-2 text-sm text-black duration-300 rounded-lg hover:text-black hover:bg-base whitespace-nowrap"
    >
      {children}
    </button>
  );
}

interface SaveButtonProps {
  plainCode: string;
  languageInfo: LanguageInfo;
  fileName: string;
  setFileName: (value: React.SetStateAction<string>) => void;
}

export default function SaveButton({ plainCode, languageInfo, fileName, setFileName }: SaveButtonProps) {
  const { show: showSaveModal } = useModal(SaveModal);
  const { show: showChoice } = useModal(SaveChoiceModal);
  const { modifyId } = useModifyState();

  const handleSaveLocal = () => {
    downloadLocalFile(plainCode, fileName, languageInfo.extension);
  };

  const handleSaveCloud = () => {
    if (modifyId) {
      showChoice({ code: plainCode, language: languageInfo.name, fileName, setFileName });
    } else {
      showSaveModal({ code: plainCode, language: languageInfo.name, setFileName });
    }
  };

  return (
    <div className="relative h-full">
      <div className="peer flex items-center min-w-[8vh] justify-center px-[max(2vh,25px)] h-full text-[max(1.2vh,10px)] font-light text-black rounded whitespace-nowrap border drop-shadow-lg shadow">
        저장하기
      </div>
      <div className="absolute z-10 items-center justify-between hidden gap-2 p-2 -translate-x-1/2 bg-white border rounded-lg shadow left-1/2 -top-12 peer-hover:flex hover:flex drop-shadow-lg">
        <SaveButtonElement onClick={handleSaveLocal}>로컬에 저장</SaveButtonElement>
        <SaveButtonElement onClick={handleSaveCloud}>클라우드에 저장</SaveButtonElement>
      </div>
    </div>
  );
}
