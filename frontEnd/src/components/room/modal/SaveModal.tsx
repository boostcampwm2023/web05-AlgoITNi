import { useMutation } from '@tanstack/react-query';
import useFocus from '@/hooks/useFocus';
import useInput from '@/hooks/useInput';
import useModal from '@/hooks/useModal';
import SuccessModal from './SuccessModal';
import LoginModal from './LoginModal';
import postUserCode from '@/apis/postUserCode';
import reactQueryClient from '@/configs/reactQueryClient';
import createAuthFailCallback from '@/utils/authFailCallback';
import QUERY_KEYS from '@/constants/queryKeys';
import { Language } from '@/types/editor';
import { EDITOR_LANGUAGE_TYPES } from '@/constants/editor';

export default function SaveModal({
  code,
  language,
  setFileName,
}: {
  code: string;
  language: Language;
  setFileName: (value: React.SetStateAction<string>) => void;
}) {
  const { inputValue, onChange } = useInput('');
  const ref = useFocus<HTMLInputElement>();
  const { show: showSuccessModal } = useModal(SuccessModal);
  const { show: showLoginModal } = useModal(LoginModal);
  const { hide } = useModal();

  const mutationSuccess = () => {
    showSuccessModal();
    reactQueryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOAD_CODES] });
  };

  const { mutate } = useMutation({
    mutationFn: () => postUserCode(`${inputValue}.${EDITOR_LANGUAGE_TYPES[language].extension}`, code, language),
    onSuccess: () => mutationSuccess,
    onError: createAuthFailCallback(() => showLoginModal({ code })),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue && ref.current) return ref.current.focus();

    setFileName(`${inputValue}.${EDITOR_LANGUAGE_TYPES[language].extension}`);
    mutate();
    return hide();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-xl">저장될 코드의 파일 이름을 입력해주세요</div>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-center gap-4">
          <input ref={ref} value={inputValue} onChange={onChange} className="px-4 py-2 text-xl" placeholder="solution" />
          <div className={inputValue ? '' : 'opacity-50'}>
            <button type="submit" className="px-6 py-2 text-lg text-white rounded-lg font-Pretendard drop-shadow-lg bg-point-blue">
              저장하기
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
