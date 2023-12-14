import { MediaObject } from '@/hooks/useMedia';
import Video from '../common/Video';
import MediaSelector from './MediaSelector';
import useSpeaker from '@/stores/useSpeaker';
import EmptyVideo from './EmptyVideo';
import MicControlButton from '../common/MicControlButton';
import VideoControlButton from '../common/VideoControlButton';

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
    <div className="flex flex-col w-full h-full gap-5">
      <div className="relative w-full h-[60vh]">
        <Video stream={stream} muted />
        <div className="absolute flex items-center justify-center w-full gap-6 bottom-4">
          <MicControlButton
            className="p-3 border-2 border-white border-solid rounded-full w-[72px] tablet:w-14 hover:opacity-50"
            stream={stream}
            onColor="white"
            offColor="white"
          />
          <VideoControlButton
            className="p-3 border-2 border-white border-solid rounded-full w-[72px] tablet:w-14 hover:opacity-50"
            stream={stream}
            onColor="white"
            offColor="white"
          />
        </div>
      </div>
      <div className="flex gap-2.5">
        {selector.map(
          ({ list, setFunc }, index) =>
            list && (
              <MediaSelector
                stream={stream}
                className="w-1/3 p-2 text-xl bg-transparent"
                key={index + stream.id}
                optionsData={list as MediaDeviceInfo[]}
                setFunc={setFunc as React.Dispatch<React.SetStateAction<string>>}
              />
            ),
        )}
      </div>
    </div>
  );
}
