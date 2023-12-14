import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import useInput from '@/hooks/useInput';
import useRoomConfigData from '@/stores/useRoomConfigData';

export default function Home() {
  const navigate = useNavigate();
  const { inputValue, onChange } = useInput('');
  const { settingOff, stopConnection } = useRoomConfigData((state) => state.actions);

  useEffect(() => {
    settingOff();
    stopConnection();
  }, []);

  const handleMakeRoomClick = () => {
    const roomId = uuidv4();
    navigate(`/${roomId}`);
  };

  const handleJoinRoomClick = () => {
    if (inputValue) navigate(`/${inputValue}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') handleJoinRoomClick();
  };

  return (
    <div className="h-screen w-screen bg-base flex justify-center items-center py-[10vw] ">
      <div className="flex flex-col basis-2/4 pc:gap-[130px] mobile:gap-[50px] justify-center items-center ">
        <div className="flex flex-col justify-center">
          <div className="text-[8.8vw] font-normal tracking-tight font-Pretendard">AlgoITNi</div>
          <div className="text-[1.4vw]  font-Pretendard">AlgoITNi를 통해 동료, 친구와 함께 알고리즘을 학습해봐요!</div>
        </div>
        <div className="flex items-center justify-center w-[37vw] gap-3">
          <Button.Default onClick={handleMakeRoomClick} fontSize="1.5vw">
            방생성
          </Button.Default>
          <input
            placeholder=""
            className="rounded-2xl font-Pretendard px-[1.6vw] py-[14px] text-[1.5vw] w-3/5"
            value={inputValue}
            onChange={onChange}
            onKeyDown={handleKeyDown}
          />

          <button
            type="button"
            className="text-[1.5vw] font-bold text-mainColor font-Pretendard"
            onClick={handleJoinRoomClick}
            style={{
              opacity: inputValue ? '1' : '0.4',
            }}
          >
            참여
          </button>
        </div>
      </div>
      <div className="basis-2/4 max-w-[600px] max-h-[600px] mobile:hidden">
        <picture>
          <source height="600px" width="600px" srcSet="/main.webp" type="image/webp" />
          <img height="600px" width="600px" src="/main.png" alt="main" />
        </picture>
      </div>
    </div>
  );
}
