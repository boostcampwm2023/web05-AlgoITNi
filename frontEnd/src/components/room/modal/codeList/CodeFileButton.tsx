import { useMutation } from '@tanstack/react-query';
import { LoadCodeData } from '@/types/loadCodeData';
import cancelIcon from '@/assets/cancelIcon.svg';
import useModal from '@/hooks/useModal';
import WarningModal from '../WarningModal';
import deleteUserCode from '@/apis/deleteUserCodes';
import reactQueryClient from '@/configs/reactQueryClient';
import QUERY_KEYS from '@/constants/queryKeys';

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
  const { show } = useModal(WarningModal);
  const { mutate } = useMutation({
    mutationFn: (id: string) => deleteUserCode(id),
    onSuccess: () => reactQueryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOAD_CODES] }),
  });

  const handleClick = () => {
    if (code.id !== selectOne) setSelectOne(code.id);
  };

  const handleDeleteButton = () => {
    show({
      warningString: '선택한 파일이 삭제됩니다.',
      callback: () => {
        mutate(code.id);
      },
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className="flex flex-col items-center justify-center col-span-1"
    >
      <div className="relative w-1/3 group">
        <img src={`/${code.language}File.png`} alt="fileIcon" />

        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
        <div className="absolute -top-3 -right-2 w-[50px] group-hover:block hidden" onClick={handleDeleteButton}>
          <img src={cancelIcon} alt="cancel" />
        </div>
      </div>
      <div>{code.title}</div>
    </button>
  );
}
