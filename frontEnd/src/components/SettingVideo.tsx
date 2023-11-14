import useMedia from '@/hooks/useMedia';
import MediaSelector from './MediaSelector';
import Video from './Video';

export default function SettingVideo() {
  const { stream, camera, mic, speaker } = useMedia();
  const { list: cameraList, setCamera } = camera;
  const { list: micList, setMic } = mic;
  const { list: speakerList, setSpeaker } = speaker;

  return (
    stream && (
      <div className="flex flex-col gap-[20px]">
        <Video stream={stream} />
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
