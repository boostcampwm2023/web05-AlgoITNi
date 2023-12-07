import { useEffect } from 'react';
import useRoomConfigData from '@/stores/useRoomConfigData';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import useInput from '@/hooks/useInput';
import randomNameGenerator from '@/utils/randomNameGenerator';
import useFocus from '@/hooks/useFocus';

export default function UserInputArea() {
  const mediaPermission = useRoomConfigData((state) => state.mediaPermisson);
  const { isConnectionError, isSignalingError, isSettingDone } = useRoomConfigData();
  const { setNickname, settingOn, settingOff, resolveConnectionError, resolveSignalError } = useRoomConfigData((state) => state.actions);

  const { inputValue, onChange } = useInput(randomNameGenerator());

  const ref = useFocus<HTMLInputElement>();

  const handleClickJoinRoomButton = () => {
    resolveConnectionError();
    resolveSignalError();
    setNickname(inputValue);
    localStorage.setItem('nickName', inputValue);
    settingOn();
  };

  useEffect(settingOff, [isConnectionError, isSignalingError]);

  return (
    <>
      <div className="flex flex-col w-full gap-2 text-xl">
        <h2 className="font-medium">닉네임을 설정해보세요!</h2>
        <input className="p-4 rounded-lg drop-shadow-lg" type="text" ref={ref} value={inputValue} onChange={onChange} />
      </div>
      <div className="flex flex-col w-full gap-2">
        {mediaPermission ? (
          <Button.Full
            onClick={handleClickJoinRoomButton}
            fontSize="20px"
            className={isConnectionError || isSignalingError ? 'animate-[vibration_.5s_linear]' : ''}
          >
            {isSettingDone ? <Spinner /> : '참여'}
          </Button.Full>
        ) : (
          <div className="flex items-center justify-center w-full py-4 text-lg text-white border rounded-lg drop-shadow-lg bg-point-red">
            카메라 권한을 확인해주세요!
          </div>
        )}
        <div className="h-7">
          {isConnectionError && <span className="text-lg font-semibold text-point-red">방이 가득 찼습니다!</span>}
          {isSignalingError && (
            <span className="text-lg font-semibold text-point-red">연결 과정에서 오류가 발생했습니다. 새로고침 후 다시 시도해주세요!</span>
          )}
        </div>
      </div>
    </>
  );
}
