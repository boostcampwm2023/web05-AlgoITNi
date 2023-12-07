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
  const ref = useFocus<HTMLInputElement>();
  const { inputValue, onChange } = useInput(randomNameGenerator());
  // const { isConnectionError, isSignalingError } = useRoomConfigData();

  const onClick = () => {
    setNickname(inputValue);
    localStorage.setItem('nickName', inputValue);
    settingOn();
  };

  return (
    <div>
      <div className="mb-[5%]  mx-[7vw] mt-4">
        <Header />
      </div>
      <main className="flex px-[7vw]">
        <div className="basis-7/12">
          <SettingVideo mediaObject={mediaObject} />
        </div>
        <div className="flex flex-col items-center justify-center w-screen basis-5/12">
          <div className="w-[80%] flex flex-col items-center justify-center gap-[50px]">
            <div className="text-[2.5vw] font-bold ">참여할 준비가 되셨나요?</div>
            <div className="flex flex-col gap-2 text-xl">
              <h2 className="font-bold">닉네임을 설정해보세요!</h2>
              <input className="p-2 border-2 border-black" type="text" ref={ref} value={inputValue} onChange={onChange} />
            </div>

            <Button.Full onClick={onClick} fontSize="1.8vw">
              참여
            </Button.Full>
          </div>
        </div>
      </main>
    </div>
  );
}
