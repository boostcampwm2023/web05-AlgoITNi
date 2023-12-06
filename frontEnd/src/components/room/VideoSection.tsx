import { MediaObject } from '@/hooks/useMedia';
import MyVideo from './video/MyVideo';
import OtherVideos, { StreamType } from './video/OtherVideos';

interface VideoSectionProps {
  mediaObject: MediaObject;
  streamList: StreamType[];
}

export default function VideoSection({ mediaObject, streamList }: VideoSectionProps) {
  return (
    <div className="flex justify-start w-full h-full gap-4">
      <MyVideo mediaObject={mediaObject} />
      <OtherVideos streamList={streamList} />
    </div>
  );
}
