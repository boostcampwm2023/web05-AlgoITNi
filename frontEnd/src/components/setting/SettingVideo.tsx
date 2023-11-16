import { MediaObject } from '@/hooks/useMedia';
import Video from '../common/Video';
import MediaSelector from './MediaSelector';

import MediaControlButton from '../common/MediaControlButton';
import useSpeaker from '@/stores/useSpeaker';

export default function SettingVideo({ mediaObject }: { mediaObject: MediaObject }) {
  const { stream, camera, mic, speaker } = mediaObject;
  const setSpeaker = useSpeaker((state) => state.setSpeaker);

  const selector = [
    { list: camera.list, setFunc: camera.setCamera },
    { list: mic.list, setFunc: mic.setMic },
    { list: speaker.list, setFunc: setSpeaker },
  ];
  return (
    stream && (
      <div className="flex flex-col gap-[20px] w-full h-full">
        <div className="relative w-full h-[550px]">
          <Video stream={stream} muted />
          <div className="absolute flex items-center justify-center w-full gap-[1vw] bottom-[10px]">
            <MediaControlButton
              stream={stream}
              kind="mic"
              className="w-[5vw] p-[1vw] hover:opacity-50 border-solid border-[1px] rounded-[50%] border-white"
            />
            <MediaControlButton
              stream={stream}
              kind="video"
              className="w-[5vw] p-[1vw] hover:opacity-50 border-solid border-[1px] rounded-[50%] border-white"
            />
          </div>
        </div>
        <div className="flex gap-[10px]">
          {selector.map(
            ({ list, setFunc }, i) =>
              list && (
                <MediaSelector
                  key={i}
                  stream={stream}
                  optionsData={list as MediaDeviceInfo[]}
                  setFunc={setFunc as React.Dispatch<React.SetStateAction<string>>}
                />
              ),
          )}
        </div>
      </div>
    )
  );
}
