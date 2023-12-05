import Video from '@/components/common/Video';

export type StreamType = {
  id: string;
  stream: MediaStream;
};
interface OtherVideosProps {
  streamList: StreamType[];
}

export default function OtherVideos({ streamList }: OtherVideosProps) {
  return streamList.map(({ id, stream }) => (
    <div className="flex basis-1/4 " key={id}>
      <Video stream={stream} />
    </div>
  ));
}
