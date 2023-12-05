import { MediaObject } from '@/hooks/useMedia';
import Video from '../common/Video';
import MediaSelector from './MediaSelector';
import useSpeaker from '@/stores/useSpeaker';
import EmptyVideo from './EmptyVideo';
import VideoControlButton from './VideoControlButton';
import MicControlButton from './MicControlButton';

export default function SettingVideo({ mediaObject }: { mediaObject: MediaObject }) {
  const { stream, camera, mic, speaker } = mediaObject;
  const setSpeaker = useSpeaker((state) => state.setSpeaker);

  const selector = [
    { list: camera.list, setFunc: camera.setCamera },
    { list: mic.list, setFunc: mic.setMic },
    { list: speaker.list, setFunc: setSpeaker },
  ];

  if (!stream) return <EmptyVideo />;

  return (
    <div className="flex flex-col gap-[20px] w-full h-full">
      <div className="relative w-full h-[60vh]">
        <Video stream={stream} muted />
        <div className="absolute flex items-center justify-center w-full gap-[1vw] bottom-[10px]">
          <MicControlButton stream={stream} />
          <VideoControlButton stream={stream} />
        </div>
      </div>
      <div className="flex gap-[10px]">
        {selector.map(
          ({ list, setFunc }, i) =>
            list && (
              <MediaSelector
                stream={stream}
                className="w-[33%] font-Pretendard text-xl"
                key={i}
                optionsData={list as MediaDeviceInfo[]}
                setFunc={setFunc as React.Dispatch<React.SetStateAction<string>>}
              />
            ),
        )}
      </div>
    </div>
  );
}
