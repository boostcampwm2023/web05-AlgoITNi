import useMediaControl from '@/stores/useMediaControl';
import { MediaControlButtonProps } from './VideoControlButton';
import MicOffSvg from '@/assets/MicOffSvg';
import MicOnSvg from '@/assets/MicOnSvg';

export default function MicControlButton({ stream, className, onColor, offColor }: MediaControlButtonProps) {
  const { micOn, micToggle } = useMediaControl((state) => state);

  const muteMic = () => {
    stream?.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
  };

  const handleMicClick = () => {
    muteMic();
    micToggle();
  };

  return (
    <button
      type="button"
      onClick={handleMicClick}
      className={className}
      style={{ backgroundColor: micOn ? 'transparent' : '#ea4335', transition: 'all 0.5s' }}
    >
      {micOn ? <MicOnSvg color={onColor} /> : <MicOffSvg color={offColor} />}
    </button>
  );
}
