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
    <div className="col-span-1 tablet:max-w-[250px] tablet:min-h-[150px]" key={id}>
      <Video stream={stream} />
    </div>
  ));
}
