import { MediaObject } from '@/hooks/useMedia';
import Video from '../common/Video';
import Section from '../common/SectionWrapper';

type StreamType = {
  id: string;
  stream: MediaStream;
};

export default function VideoSection({ mediaObject, streamList }: { mediaObject: MediaObject; streamList: StreamType[] }) {
  return (
    <div className="flex justify-start w-full h-full gap-4">
      <div className="flex basis-1/4 ">
        <Section>
          <Video stream={mediaObject.stream as MediaStream} muted />
        </Section>
      </div>
      {streamList.map(({ id, stream }) => (
        <div className="flex basis-1/4 " key={id}>
          <Section>
            <Video stream={stream} />
          </Section>
        </div>
      ))}
    </div>
  );
}
