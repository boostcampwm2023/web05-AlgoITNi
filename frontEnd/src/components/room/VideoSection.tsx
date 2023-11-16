import { MediaObject } from '@/hooks/useMedia';
import Video from '../common/Video';

export default function VideoSection({
  mediaObject,
  streamList,
}: {
  mediaObject: MediaObject;
  streamList: {
    id: string;
    stream: MediaStream;
  }[];
}) {
  return (
    <div className="flex justify-start w-full h-full gap-4">
      <div className="flex basis-1/4 ">
        <Video stream={mediaObject.stream as MediaStream} muted />
      </div>
      {streamList.map(({ id, stream }) => (
        <div className="flex basis-1/4 " key={id}>
          <Video stream={stream} />
        </div>
      ))}
    </div>
  );
}
