import VideoOffSvg from '@/assets/VideoOffSvg';
import VideoOnSvg from '@/assets/VideoOnSvg';
import useMediaControl from '@/stores/useMediaControl';

export interface MediaControlButtonProps {
  stream: MediaStream;
  className: string;
  onColor: string;
  offColor: string;
}

export default function VideoControlButton({ stream, className, onColor, offColor }: MediaControlButtonProps) {
  const { videoOn, videoToggle } = useMediaControl((state) => state);

  const offVideo = () => {
    stream?.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
  };

  const handleClick = () => {
    offVideo();
    videoToggle();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
      style={{ backgroundColor: videoOn ? 'transparent' : '#ea4335', transition: 'all 0.5s' }}
    >
      {videoOn ? <VideoOnSvg color={onColor} /> : <VideoOffSvg color={offColor} />}
    </button>
  );
}
