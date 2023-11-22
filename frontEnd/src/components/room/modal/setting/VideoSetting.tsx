import Video from '@/components/common/Video';
import MediaSelector from '@/components/setting/MediaSelector';
import { SettingProps } from '@/types/settingModal';
import videoSrc from '@/assets/video.svg';

export default function VideoSetting({ stream, camera }: { stream: MediaStream; camera: SettingProps }) {
  stream.getVideoTracks().forEach((track) => {
    track.enabled = true;
  });
  return (
    <div className="flex flex-col gap-4">
      <div className="flex">
        <img src={videoSrc} alt="video" width="40px" />
        <MediaSelector
          className="text-[1vw]"
          optionsData={camera.list as MediaDeviceInfo[]}
          setFunc={camera.setFunc as React.Dispatch<React.SetStateAction<string>>}
        />
      </div>
      <div className="h-[45vh]">
        <Video stream={stream} />
      </div>
    </div>
  );
}
