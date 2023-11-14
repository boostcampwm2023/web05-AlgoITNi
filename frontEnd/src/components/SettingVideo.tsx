import { ReactNode, useState } from 'react';
import useMedia from '@/hooks/useMedia';
import MediaSelector from './MediaSelector';
import Video from './Video';
import micOnSVG from '@/assets/micOn.svg';
import micOffSVG from '@/assets/micOff.svg';
import videoOffSVG from '@/assets/videoOff.svg';
import videoOnSVG from '@/assets/videoOn.svg';

function ControlButton({ onClick, style, children }: { onClick: () => void; style: Record<string, string>; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-[5vw] p-[1vw] hover:opacity-50 border-solid border-[1px] rounded-[50%] border-white"
      style={style}
    >
      {children}
    </button>
  );
}

export default function SettingVideo() {
  const { stream, camera, mic, speaker } = useMedia();
  const { list: cameraList, setCamera } = camera;
  const { list: micList, setMic } = mic;
  const { list: speakerList, setSpeaker } = speaker;
  const [micOn, setMicOn] = useState(true);

  const [videoOn, setVideoOn] = useState(true);

  const offVideo = () => {
    stream?.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
  };

  const muteMic = () => {
    stream?.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
  };
  const handleMicClick = () => {
    setMicOn((prev) => !prev);
    muteMic();
  };
  const handleVideoClick = () => {
    setVideoOn((prev) => !prev);
    offVideo();
  };
  return (
    stream && (
      <div className="flex flex-col gap-[20px] ">
        <div className="relative">
          <Video stream={stream} />
          <div className="absolute flex items-center justify-center w-full gap-[1vw] bottom-[10px]">
            <ControlButton onClick={handleMicClick} style={{ backgroundColor: micOn ? 'transparent' : '#ea4335', transition: 'all 0.5s' }}>
              <img src={micOn ? micOnSVG : micOffSVG} alt="micButton" />
            </ControlButton>
            <ControlButton
              onClick={handleVideoClick}
              style={{ backgroundColor: videoOn ? 'transparent' : '#ea4335', transition: 'all 0.5s' }}
            >
              <img src={videoOn ? videoOnSVG : videoOffSVG} alt="videoButton" />
            </ControlButton>
          </div>
        </div>
        <div className="flex gap-[10px]">
          {[
            [cameraList, setCamera],
            [micList, setMic],
            [speakerList, setSpeaker],
          ].map(
            ([deviceList, setFunc], i) =>
              deviceList && (
                <MediaSelector
                  key={i}
                  stream={stream}
                  optionsData={deviceList as MediaDeviceInfo[]}
                  setFunc={setFunc as React.Dispatch<React.SetStateAction<string>>}
                />
              ),
          )}
        </div>
      </div>
    )
  );
}
