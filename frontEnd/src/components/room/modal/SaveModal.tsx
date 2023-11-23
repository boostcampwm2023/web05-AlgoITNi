import { isAxiosError } from 'axios';
import Button from '@/components/common/Button';
import useFocus from '@/hooks/useFocus';
import useInput from '@/hooks/useInput';
import useModal from '@/hooks/useModal';
import SuccessModal from './SuccessModal';
import LoginModal from './LoginModal';
import postUserCode from '@/apis/postUserCode';

export default function SaveModal({ hide, code }: { hide: () => void; code: string }) {
  const { inputValue, onChange } = useInput('');
  const ref = useFocus<HTMLInputElement>();
  const { show: showSuccessModal, hide: hideSuccessModal } = useModal(SuccessModal);
  const { show: showLoginModal, hide: hideLoginModal } = useModal(LoginModal);

  const handleClick = async () => {
    if (!inputValue) {
      if (ref.current) ref.current.focus();
      return;
    }
    hide();
    try {
      await postUserCode(inputValue, code);
      showSuccessModal({ hide: hideSuccessModal });
    } catch (err) {
      if (isAxiosError(err) && err.response && err.response.status === 401) {
        showLoginModal({ hide: hideLoginModal });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => e.key === 'Enter' && handleClick();

  return (
    <div className="flex flex-col gap-4">
      <div className="text-xl">저장될 코드의 파일 이름을 입력해주세요</div>
      <div className="flex items-center justify-center gap-4">
        <input
          ref={ref}
          value={inputValue}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          className="px-4 py-2 text-xl"
          placeholder="solution.py"
        />
        <div className={inputValue ? '' : 'opacity-50'}>
          <Button.Default onClick={handleClick} fontSize="1vw">
            저장하기
          </Button.Default>
        </div>
      </div>
    </div>
  );
}
