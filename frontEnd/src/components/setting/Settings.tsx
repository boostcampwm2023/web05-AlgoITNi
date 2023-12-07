import randomNameGenerator from '@utils/randomNameGenerator';
import { MediaObject } from '@/hooks/useMedia';
import Button from '../common/Button';
import SettingVideo from './SettingVideo';
import Header from '../common/Header';
import useFocus from '@/hooks/useFocus';
import useInput from '@/hooks/useInput';
import useRoomConfigData from '@/stores/useRoomConfigData';

export default function Setting({ mediaObject }: { mediaObject: MediaObject }) {
  const { setNickname, settingOn } = useRoomConfigData((state) => state.actions);
  const { inputValue, onChange } = useInput(randomNameGenerator());
  // const { isConnectionError, isSignalingError } = useRoomConfigData();

  const ref = useFocus<HTMLInputElement>();

  const onClick = () => {
    setNickname(inputValue);
    localStorage.setItem('nickName', inputValue);
    settingOn();
  };

  return (
    <div className="min-h-screen min-w-screen bg-base">
      <Header />
      <main className="flex px-[7vw] gap-10 tablet:flex-col">
        <div className="basis-7/12">
          <SettingVideo mediaObject={mediaObject} />
        </div>
        <div className="flex flex-col items-center justify-center px-10 my-10 basis-5/12 tablet:px-0 mobile:px-0">
          <div className="flex flex-col items-start justify-center w-full gap-12">
            <div className="text-5xl font-bold whitespace-nowrap mobile:text-4xl">참여할 준비가 되셨나요?</div>
            <div className="flex flex-col w-full gap-2 text-xl">
              <h2 className="font-bold">닉네임을 설정해보세요!</h2>
              <input className="p-4 rounded-lg drop-shadow-lg" type="text" ref={ref} value={inputValue} onChange={onChange} />
            </div>
            <Button.Full onClick={onClick} fontSize="20px">
              참여
            </Button.Full>
          </div>
        </div>
      </main>
    </div>
  );
}
