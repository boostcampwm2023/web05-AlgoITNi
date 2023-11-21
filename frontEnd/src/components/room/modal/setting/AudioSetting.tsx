import { useEffect, useRef, useState } from 'react';
import MediaSelector from '@/components/setting/MediaSelector';
import micSrc from '@/assets/mic.svg';
import speakerSrc from '@/assets/speaker.svg';
import Button from '@/components/common/Button';
import useSpeaker from '@/stores/useSpeaker';
import { SettingProps } from '@/types/settingModal';

function AudioSelector({
  imgSrc,
  media,
  testState,
  startTest,
  stopTest,
  playRef,
}: {
  imgSrc: string;
  media: SettingProps;
  testState: boolean;
  startTest: () => void;
  stopTest: () => void;
  playRef: React.RefObject<HTMLAudioElement>;
}) {
  return (
    <div className="flex items-center w-full basis-1/2">
      <div className="flex items-center w-full">
        <div className="flex w-[70%]">
          <img src={imgSrc} alt="mic" width="40px" />
          <MediaSelector
            className="w-[80%] text-[1vw] "
            optionsData={media.list as MediaDeviceInfo[]}
            setFunc={media.setFunc as React.Dispatch<React.SetStateAction<string>>}
          />
        </div>

        <Button.Default onClick={testState ? stopTest : startTest} fontSize="1vw">
          {testState ? '중지' : '테스트'}
        </Button.Default>
        <audio ref={playRef} autoPlay>
          <track kind="captions" />
        </audio>
      </div>
    </div>
  );
}

export default function AudioSetting({ stream, mic, speaker }: { stream: MediaStream; mic: SettingProps; speaker: SettingProps }) {
  const [micTest, setMicTest] = useState(false);
  const [speakerTest, setSpeakerTest] = useState(false);

  const speakerDevice = useSpeaker((state) => state.speaker);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mp3Ref = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setMicTest(false);
    if (audioRef.current) audioRef.current.srcObject = stream;
  }, [stream]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (mp3Ref.current as any).setSinkId?.(speakerDevice);
  }, [speakerDevice]);

  const startMicTest = () => {
    if (!audioRef.current) return;
    stream.getAudioTracks().forEach((track) => {
      track.enabled = true;
    });
    setMicTest(true);
  };

  const stopMicTest = () => {
    if (!audioRef.current) return;
    audioRef.current.srcObject = null;
    setMicTest(false);
  };

  const startSpeakerTest = () => {
    if (!mp3Ref.current) return;
    mp3Ref.current.src = '/dreams.mp3';
    setSpeakerTest(true);
  };
  const stopSpeakerTest = () => {
    if (!mp3Ref.current) return;
    mp3Ref.current.src = '';
    setSpeakerTest(false);
  };

  return (
    <div className="flex flex-col items-center w-full h-full">
      <AudioSelector imgSrc={micSrc} media={mic} testState={micTest} startTest={startMicTest} stopTest={stopMicTest} playRef={audioRef} />
      <AudioSelector
        imgSrc={speakerSrc}
        media={speaker}
        testState={speakerTest}
        startTest={startSpeakerTest}
        stopTest={stopSpeakerTest}
        playRef={mp3Ref}
      />
    </div>
  );
}
