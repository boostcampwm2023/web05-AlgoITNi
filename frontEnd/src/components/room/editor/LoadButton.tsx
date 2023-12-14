import { useState, useEffect, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import getUserCodes from '@/apis/getUserCodes';
import useModal from '@/hooks/useModal';
import { uploadLocalFile } from '@/utils/file';
import CodeListModal from '../modal/CodeListModal';
import LoginModal from '../modal/LoginModal';
import createAuthFailCallback from '@/utils/authFailCallback';
import sendMessageDataChannels from '@/utils/sendMessageDataChannels';
import { EDITOR_LANGUAGE_TYPES } from '@/constants/editor';
import QUERY_KEYS from '@/constants/queryKeys';
import { CRDTContext } from '@/contexts/crdt';
import useDataChannels from '@/stores/useDataChannels';

function LoadButtonElement({ children, onClick }: { children: React.ReactNode; onClick: React.MouseEventHandler<HTMLButtonElement> }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center px-4 py-2 text-sm text-black duration-300 rounded-lg hover:text-black hover:bg-base whitespace-nowrap"
    >
      {children}
    </button>
  );
}

interface LoadButtonProps {
  plainCode: string;
  setPlainCode: (value: React.SetStateAction<string>) => void;
  setLanguageName: (value: React.SetStateAction<string>) => void;
  setFileName: (value: React.SetStateAction<string>) => void;
}

export default function LoadButton({ plainCode, setPlainCode, setLanguageName, setFileName }: LoadButtonProps) {
  const [click, setClick] = useState(false);

  const { show } = useModal(CodeListModal);
  const { show: showLoginModal } = useModal(LoginModal);
  const errorCallback = createAuthFailCallback(() => showLoginModal({ code: plainCode }));

  const { data, isError, error } = useQuery({
    queryKey: [QUERY_KEYS.LOAD_CODES],
    queryFn: getUserCodes,
    enabled: click,
  });

  const { codeDataChannel } = useDataChannels();

  const crdt = useContext(CRDTContext);

  useEffect(() => {
    if (data && click) {
      show({ codeData: data, setPlainCode, setLanguage: setLanguageName, setFileName });
      setClick(false);
    }
    if (isError && click) {
      errorCallback(error);
      setClick(false);
    }
  }, [click, data, isError]);

  const handleLoadLocalCodeFile = () => {
    uploadLocalFile((name, code, languageName) => {
      setFileName(`${name}.${EDITOR_LANGUAGE_TYPES[languageName].extension}`);
      setPlainCode(code);
      setLanguageName(languageName);

      crdt.delete(0, crdt.toString().length);
      sendMessageDataChannels(codeDataChannel, crdt.encodeData());

      crdt.insert(0, code);
      sendMessageDataChannels(codeDataChannel, crdt.encodeData());
    });
  };

  const handleLoadCloudCodeFile = () => setClick(true);

  return (
    <div className="relative h-full">
      <div className="flex items-center justify-center w-24 h-full px-4 text-sm text-black rounded shadow cursor-pointer peer drop-shadow-lg whitespace-nowrap bg-base mobile:px-2 mobile:py-1 mobile:w-16">
        불러오기
      </div>
      <div className="absolute z-10 items-center justify-between hidden gap-2 p-2 -translate-x-1/2 bg-white border rounded-lg drop-shadow-lg left-1/2 -top-12 peer-hover:flex hover:flex">
        <LoadButtonElement onClick={handleLoadLocalCodeFile}>로컬에서 불러오기</LoadButtonElement>
        <LoadButtonElement onClick={handleLoadCloudCodeFile}>클라우드에서 불러오기</LoadButtonElement>
      </div>
    </div>
  );
}
