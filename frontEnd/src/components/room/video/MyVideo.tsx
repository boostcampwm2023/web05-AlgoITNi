import Video from '@/components/common/Video';
import { MediaObject } from '@/hooks/useMedia';

interface MyVideoProps {
  mediaObject: MediaObject;
}

export default function MyVideo({ mediaObject }: MyVideoProps) {
  if (mediaObject.stream)
    return (
      <div className="col-span-1 tablet:max-w-[250px] tablet:min-h-[150px]">
        <Video stream={mediaObject.stream} muted />
      </div>
    );

  return (
    <div className="col-span-1 tablet:max-w-[250px] tablet:min-h-[150px]">
      <div className="w-full h-full bg-black rounded-3xl shadow-black drop-shadow-2xl" />
    </div>
  );
}
