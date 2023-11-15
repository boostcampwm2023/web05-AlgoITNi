import { useState } from 'react';
import { useParams } from 'react-router-dom';
import useRoom from '@/hooks/useRoom';
import Editor from '@/components/Editor';
import Setting from '@/components/Settings';
import useMedia from '@/hooks/useMedia';
import Video from '@/components/Video';

export default function Room() {
  const { roomId } = useParams();
  const mediaObject = useMedia();
  const [isSetting, setSetting] = useState(false);
  const { streamList, dataChannels } = useRoom(roomId as string, mediaObject.stream as MediaStream, isSetting);

  if (!isSetting) return <Setting mediaObject={mediaObject} setSetting={setSetting} />;

  return (
    <div>
      <Video stream={mediaObject.stream as MediaStream} muted />
      {streamList.map(({ id, stream }) => (
        <Video key={id} stream={stream} />
      ))}
      <div className="w-[700px] h-[600px]">
        <Editor dataChannels={dataChannels} />
      </div>
    </div>
  );
}
