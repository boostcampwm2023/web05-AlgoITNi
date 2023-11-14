import { useEffect, useRef } from 'react';
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
  const { videoRef, streamList } = useRoom(roomId as string);

  return (
    <div>
      <video ref={videoRef} muted autoPlay />
      {streamList.map(({ id, stream }) => (
        <StreamVideo key={id} stream={stream} />
      ))}
    </div>
  );
}
