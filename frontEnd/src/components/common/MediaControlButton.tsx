import micOnSVG from '@/assets/micOn.svg';
import micOffSVG from '@/assets/micOff.svg';
import videoOffSVG from '@/assets/videoOff.svg';
import videoOnSVG from '@/assets/videoOn.svg';
import useMediaControl from '@/stores/useMediaControl';

function selectImage(kind: 'mic' | 'video', state: boolean) {
  if (kind === 'mic' && state) return micOnSVG;
  if (kind === 'mic' && !state) return micOffSVG;
  if (kind === 'video' && state) return videoOnSVG;
  if (kind === 'video' && !state) return videoOffSVG;
  throw new Error('잘못된 입력입니다!');
}

export default function MediaControlButton({ stream, kind, className }: { stream: MediaStream; kind: 'mic' | 'video'; className: string }) {
  const { micOn, micToggle } = useMediaControl((state) => state);
  const { videoOn, videoToggle } = useMediaControl((state) => state);
  const state = kind === 'mic' ? micOn : videoOn;
  const img = selectImage(kind, state);

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
        <img src={img} alt="micButton" />
      </button>
    );

  return (
    <button
      type="button"
      onClick={handleVideoClick}
      className={className}
      style={{ backgroundColor: videoOn ? 'transparent' : '#ea4335', transition: 'all 0.5s' }}
    >
      <img src={img} alt="videoButton" />
    </button>
  );
}
