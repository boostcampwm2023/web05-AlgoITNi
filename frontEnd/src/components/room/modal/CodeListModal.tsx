import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LoadCodeData } from '@/types/loadCodeData';
import CodeFileButton from './codeList/CodeFileButton';
import Button from '@/components/common/Button';
import useModal from '@/hooks/useModal';
import WarningModal from './WarningModal';
import getUserCodes from '@/apis/getUserCodes';
import QUERY_KEYS from '@/constants/queryKeys';
import useModifyState from '@/stores/useModifyState';

export default function CodeListModal({
  codeData,
  setPlainCode,
  setLanguage,
  setFileName,
}: {
  codeData: LoadCodeData[];
  setPlainCode: (value: React.SetStateAction<string>) => void;
  setLanguage: (value: React.SetStateAction<string>) => void;
  setFileName: (value: React.SetStateAction<string>) => void;
}) {
  const { data } = useQuery({
    queryKey: [QUERY_KEYS.LOAD_CODES],
    queryFn: getUserCodes,
  });
  const { setModifyId } = useModifyState();
  const [selectOne, setSelectOne] = useState<string>('');
  const { show } = useModal(WarningModal);
  const { hide } = useModal();

  const findById = (id: string) => {
    const result = codeData.find((code) => code.id === id);
    return result;
  };

  const handleClick = () => {
    hide();
    const result = findById(selectOne);
    if (result) {
      show({
        warningString: '작업중이던 내용이 모두 지워집니다.',
        callback: () => {
          setPlainCode(result.content);
          setModifyId(result.id);
          setLanguage(result.language);
          setFileName(result.title);
        },
      });
    }
  };
  const renderData = data || codeData;
  return (
    <div className="flex flex-col items-center justify-center w-full gap-4">
      <div className="w-full text-xl font-bold ">파일 불러오기</div>
      <div className="w-[70vw] h-[50vh] max-h-[50vh] overflow-y-auto border-y p-4">
        <div className="grid grid-cols-5 gap-4">
          {renderData.map((code) => (
            <div key={code.id} className={code.id === selectOne ? 'bg-blue-100  rounded-xl py-4' : 'py-4'}>
              <CodeFileButton code={code} handleDoubleClick={handleClick} selectOne={selectOne} setSelectOne={setSelectOne} />
            </div>
          ))}
        </div>
      </div>

      <Button.Default fontSize="1vw" onClick={handleClick}>
        적용
      </Button.Default>
    </div>
  );
}
