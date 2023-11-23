import { isAxiosError } from 'axios';
import getUserCodes from '@/apis/getUserCodes';
import useModal from '@/hooks/useModal';
import { uploadLocalFile } from '@/utils/file';
import CodeListModal from '../modal/CodeListModal';
import LoginModal from '../modal/LoginModal';

function LoadButtonElement({ children, onClick }: { children: React.ReactNode; onClick: React.MouseEventHandler<HTMLButtonElement> }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center w-32 px-4 py-2 text-sm text-white duration-300 rounded-lg hover:text-black hover:bg-base whitespace-nowrap"
    >
      {children}
    </button>
  );
}
export default function LoadButton({ setCode }: { setCode: (value: React.SetStateAction<string>) => void }) {
  const { show, hide } = useModal(CodeListModal);
  const { show: showLoginModal, hide: hideLoginModal } = useModal(LoginModal);

  const handleLoadLocalCodeFile = () => {
    uploadLocalFile((result) => setCode(result));
  };

  const handleLoadCloudCodeFile = async () => {
    try {
      const codeData = await getUserCodes();
      show({ hide, codeData, setCode });
    } catch (err) {
      if (isAxiosError(err) && err.response && err.response.status === 401) {
        showLoginModal({ hideLoginModal });
      }
    }
  };
  return (
    <div className="relative h-full">
      <div className="peer flex items-center min-w-[8vh] justify-center px-[max(2vh,25px)] h-full text-[max(1.2vh,10px)] bg-secondary font-thin text-white rounded whitespace-nowrap">
        불러오기
      </div>
      <div className="absolute z-10 items-center justify-between hidden gap-2 p-2 -translate-x-1/2 rounded-lg bg-secondary left-1/2 -top-12 peer-hover:flex hover:flex">
        <LoadButtonElement onClick={handleLoadLocalCodeFile}>로컬에서 불러오기</LoadButtonElement>
        <LoadButtonElement onClick={handleLoadCloudCodeFile}>클라우드에서 불러오기</LoadButtonElement>
      </div>
    </div>
  );
}
