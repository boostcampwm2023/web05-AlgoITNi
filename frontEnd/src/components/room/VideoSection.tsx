import { MediaObject } from '@/hooks/useMedia';
import MyVideo from './video/MyVideo';
import OtherVideos, { StreamType } from './video/OtherVideos';
import ControllSection from './ControllSection';

interface VideoSectionProps {
  mediaObject: MediaObject;
  streamList: StreamType[];
}

export default function VideoSection({ mediaObject, streamList }: VideoSectionProps) {
  return (
    <div className="grid w-full h-full grid-cols-4 gap-4 min-h-[200px] tablet:grid-cols-1">
      <MyVideo mediaObject={mediaObject} />
      <OtherVideos streamList={streamList} />
      <div className="pc:hidden">
        <ControllSection mediaObject={mediaObject} />
      </div>
    </div>
  );
}
