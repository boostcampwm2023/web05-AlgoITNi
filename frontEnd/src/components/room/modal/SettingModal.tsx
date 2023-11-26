import { useState } from 'react';
import useMedia, { MediaObject } from '@/hooks/useMedia';
import useSpeaker from '@/stores/useSpeaker';
import { SettingType } from '@/types/settingModal';
import SideBar from './setting/SideBar';
import AudioSetting from './setting/AudioSetting';
import Button from '@/components/common/Button';
import VideoSetting from './setting/VideoSetting';
import useModal from '@/hooks/useModal';

export default function SettingModal({ mediaObject }: { mediaObject: MediaObject }) {
  const [settingType, setSettingType] = useState<SettingType>('audio');
  const { hide } = useModal();

  const {
    mic: { setMic },
    camera: { setCamera },
  } = mediaObject;

  const setSpeaker = useSpeaker((state) => state.setSpeaker);
  // settings 모달만의 mediaStream을 새롭게 생성
  const { stream, mic, speaker, camera } = useMedia();
  const cameraProps = { list: camera.list, setFunc: camera.setCamera };
  const micProps = { list: mic.list, setFunc: mic.setMic };
  const speakerProps = { list: speaker.list, setFunc: setSpeaker };

  // settings 모달의 mediaStream의 정보를 토대로 room Stream의 정보를 갱신
  const applyStreamToRealStream = () => {
    if (!stream) return;
    const [settingMicTrack] = stream.getAudioTracks();
    const [settingVideoTrack] = stream.getVideoTracks();
    setMic(settingMicTrack.getSettings().deviceId as string);
    setCamera(settingVideoTrack.getSettings().deviceId as string);
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
            <VideoSetting stream={stream as MediaStream} camera={cameraProps} />
          )}
        </div>
      </div>
      <Button.Default onClick={applyStreamToRealStream} fontSize="1vw">
        적용
      </Button.Default>
    </div>
  );
}
