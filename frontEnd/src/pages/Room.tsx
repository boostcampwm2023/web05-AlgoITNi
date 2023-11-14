import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import useRoom from '@/hooks/useRoom';

function StreamVideo({ stream }: { stream: MediaStream }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    videoRef.current.srcObject = stream;
  }, []);

  return <video key={stream.id} ref={videoRef} muted autoPlay />;
}

export default function Room() {
  const { roomId } = useParams();
  const { videoRef, streamList, dataChannels } = useRoom(roomId as string);

  const [text, setText] = useState<string>('');

  const handleMessage = (event: MessageEvent) => {
    setText(event.data);
  };

  useEffect(() => {
    dataChannels.forEach(({ dataChannel }) => {
      dataChannel.onmessage = handleMessage;
    });
  }, [dataChannels]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);

    dataChannels.forEach(({ dataChannel }) => {
      if (dataChannel.readyState === 'open') dataChannel.send(event.target.value);
    });
  };

  return (
    <div>
      <video ref={videoRef} muted autoPlay />
      {streamList.map(({ id, stream }) => (
        <StreamVideo key={id} stream={stream} />
      ))}
      <textarea onChange={handleChange} value={text} />
    </div>
  );
}
