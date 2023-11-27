import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import getUserCodes from '@/apis/getUserCodes';
import useModal from '@/hooks/useModal';
import { uploadLocalFile } from '@/utils/file';
import CodeListModal from '../modal/CodeListModal';
import LoginModal from '../modal/LoginModal';
import createAuthFailCallback from '@/utils/authFailCallback';
import QUERY_KEYS from '@/constants/queryKeys';

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

interface LoadButtonProps {
  plainCode: string;
  setPlainCode: (value: React.SetStateAction<string>) => void;
  setLanguageName: (value: React.SetStateAction<string>) => void;
}

export default function LoadButton({ plainCode, setPlainCode, setLanguageName }: LoadButtonProps) {
  const [click, setClick] = useState(false);

  const { show } = useModal(CodeListModal);
  const { show: showLoginModal } = useModal(LoginModal);

  const { data, isError, error, refetch } = useQuery({
    queryKey: [QUERY_KEYS.LOAD_CODES],
    queryFn: getUserCodes,
    enabled: false,
  });

  const errorCallback = createAuthFailCallback(() => showLoginModal({ code: plainCode }));

  useEffect(() => {
    if (data && click) show({ codeData: data, setPlainCode });
    if (isError) errorCallback(error);
    setClick(false);
  }, [data, isError, click]);

  const handleLoadLocalCodeFile = () => {
    uploadLocalFile((code, languageName) => {
      setPlainCode(code);
      setLanguageName(languageName);
    });
  };

  const handleLoadCloudCodeFile = async () => {
    refetch();
    setClick(true);
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
