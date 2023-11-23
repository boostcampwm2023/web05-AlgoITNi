import { LoadCodeData } from '@/types/loadCodeData';

export default function CodeFileButton({
  code,
  handleDoubleClick,
  selectOne,
  setSelectOne,
}: {
  code: LoadCodeData;
  handleDoubleClick: () => void;
  selectOne: string;
  setSelectOne: React.Dispatch<React.SetStateAction<string>>;
}) {
  const handleClick = () => {
    if (code.id !== selectOne) setSelectOne(code.id);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className="flex flex-col items-center justify-center col-span-1"
    >
      <img src="/fileIcon.png" alt="fileIcon" className="w-1/3" />
      <div>{code.title}</div>
    </button>
  );
}
