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
      <div>
        <div className="flex items-center gap-5 mb-4">
          <img src={videoSrc} alt="video" width="25px" />
          <span className="text-xl font-bold">비디오</span>
        </div>
        <MediaSelector
          stream={stream}
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
