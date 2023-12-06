import MicOffSvg from '@/assets/MicOffSvg';
import MicOnSvg from '@/assets/MicOnSvg';
import VideoOffSvg from '@/assets/VideoOffSvg';
import VideoOnSvg from '@/assets/VideoOnSvg';
import useMediaControl from '@/stores/useMediaControl';

interface MediaControlButtonProps {
  stream: MediaStream;
  kind: 'mic' | 'video';
  className: string;
  color: string;
}

export default function MediaControlButton({ stream, kind, className, color }: MediaControlButtonProps) {
  const { micOn, micToggle } = useMediaControl((state) => state);
  const { videoOn, videoToggle } = useMediaControl((state) => state);

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
    muteMic();
    micToggle();
  };

  const handleVideoClick = () => {
    offVideo();
    videoToggle();
  };

  if (kind === 'mic')
    return (
      <button
        type="button"
        onClick={handleMicClick}
        className={className}
        style={{ backgroundColor: micOn ? 'transparent' : '#ea4335', transition: 'all 0.5s' }}
      >
        {micOn ? <MicOnSvg color={color} /> : <MicOffSvg color={color} />}
      </button>
    );

  return (
    <button
      type="button"
      onClick={handleVideoClick}
      className={className}
      style={{ backgroundColor: videoOn ? 'transparent' : '#ea4335', transition: 'all 0.5s' }}
    >
      {videoOn ? <VideoOnSvg color={color} /> : <VideoOffSvg color={color} />}
    </button>
  );
}
