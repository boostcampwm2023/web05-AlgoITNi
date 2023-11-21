import { useEffect, useRef, useState } from 'react';
import MediaSelector from '@/components/setting/MediaSelector';
import micSrc from '@/assets/mic.svg';
import speakerSrc from '@/assets/speaker.svg';
import Button from '@/components/common/Button';
import useSpeaker from '@/stores/useSpeaker';
import { SettingProps } from '@/types/settingModal';

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
      <div className="flex items-center w-full basis-1/2">
        <div className="flex items-center w-full">
          <div className="flex w-[70%]">
            <img src={micSrc} alt="mic" width="40px" />
            <MediaSelector
              className="w-[80%] text-[1vw] "
              optionsData={mic.list as MediaDeviceInfo[]}
              setFunc={mic.setFunc as React.Dispatch<React.SetStateAction<string>>}
            />
          </div>

          <Button.Default onClick={micTest ? stopMicTest : startMicTest} fontSize="1vw">
            {micTest ? '중지' : '테스트'}
          </Button.Default>
          <audio ref={audioRef} autoPlay>
            <track kind="captions" />
          </audio>
        </div>
      </div>
      <div className="flex items-center justify-start w-full basis-1/2">
        <div className="flex w-[70%]">
          <div>
            <img src={speakerSrc} alt="mic" width="40px" />
          </div>

          <MediaSelector
            className="w-[80%] text-[1vw]"
            optionsData={speaker.list as MediaDeviceInfo[]}
            setFunc={speaker.setFunc as React.Dispatch<React.SetStateAction<string>>}
          />
        </div>
        <Button.Default onClick={speakerTest ? stopSpeakerTest : startSpeakerTest} fontSize="1vw">
          {speakerTest ? '중지' : '테스트'}
        </Button.Default>
        <audio ref={mp3Ref} autoPlay>
          <track kind="captions" />
        </audio>
      </div>
    </div>
  );
}
