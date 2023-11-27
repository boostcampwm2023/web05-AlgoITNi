import { useState } from 'react';
import { LoadCodeData } from '@/types/loadCodeData';
import CodeFileButton from './codeList/CodeFileButton';
import Button from '@/components/common/Button';
import useModal from '@/hooks/useModal';

export default function CodeListModal({
  codeData,
  setPlainCode,
}: {
  codeData: LoadCodeData[];
  setPlainCode: (value: React.SetStateAction<string>) => void;
}) {
  const [selectOne, setSelectOne] = useState<string>('');
  const { hide } = useModal();

  const findById = (id: string) => {
    const result = codeData.find((data) => data.id === id);
    return result;
  };

  const handleClick = () => {
    hide();
    const result = findById(selectOne);
    if (result) setPlainCode(result.content);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full gap-4">
      <div className="w-full text-xl font-bold ">파일 불러오기</div>
      <div className="w-[70vw] h-[50vh] max-h-[50vh] overflow-y-auto border-y p-4">
        <div className="grid grid-cols-5 gap-4">
          {codeData.map((code) => (
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
