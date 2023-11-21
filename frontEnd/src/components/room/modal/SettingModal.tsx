import { useState } from 'react';
import useMedia, { MediaObject } from '@/hooks/useMedia';
import useSpeaker from '@/stores/useSpeaker';
import { SettingType } from '@/types/settingModal';
import SideBar from './setting/SideBar';
import AudioSetting from './setting/AudioSetting';
import Button from '@/components/common/Button';

export default function SettingModal({ mediaObject, hide }: { mediaObject: MediaObject; hide: () => void }) {
  const [settingType, setSettingType] = useState<SettingType>('audio');
  const {
    mic: { setMic },
  } = mediaObject;
  const setSpeaker = useSpeaker((state) => state.setSpeaker);
  const { stream, mic, speaker } = useMedia();
  const micProps = { list: mic.list, setFunc: mic.setMic };
  const speakerProps = { list: speaker.list, setFunc: setSpeaker };
  const applyStreamToRealStream = () => {
    if (!stream) return;
    const [micTrack] = stream.getAudioTracks();

    setMic(micTrack.getSettings().deviceId as string);
    hide();
  };
  return (
    <div className="flex flex-col items-center justiy-center">
      <div className="flex w-[50vw] h-[60vh] font-Pretendard">
        <SideBar settingType={settingType} setSettingType={setSettingType} />
        <div className="p-4 basis-3/4">
          {settingType === 'audio' ? (
            <AudioSetting stream={stream as MediaStream} mic={micProps} speaker={speakerProps} />
          ) : (
            <div>video</div>
          )}
        </div>
      </div>
      <Button.Default onClick={applyStreamToRealStream} fontSize="1vw">
        적용
      </Button.Default>
    </div>
  );
}
