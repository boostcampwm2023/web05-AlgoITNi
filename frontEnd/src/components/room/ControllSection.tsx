import { MediaObject } from '@/hooks/useMedia';
import MediaControlButton from '../common/MediaControlButton';

export default function ControllSection({ mediaObject }: { mediaObject: MediaObject }) {
  const { stream } = mediaObject;

  return (
    <div className="flex bg-[#132A37] rounded-lg p-2 gap-2">
      <MediaControlButton
        stream={stream as MediaStream}
        kind="mic"
        className="w-[3vw] p-[1vw] hover:opacity-50  rounded-[15px] border-white"
      />
      <MediaControlButton
        stream={stream as MediaStream}
        kind="video"
        className="w-[3vw] p-[1vw] hover:opacity-50  rounded-[15px] border-white"
      />
    </div>
  );
}
