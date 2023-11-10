import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createSocket } from '@/services/Socket';
import { StreamObject, streamModel } from '@/stores/StreamModel';
import { SOCKET_EMIT_EVENT } from '@/constants/socketEvents';

function StreamVideo({ stream }: { stream: MediaStream }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.srcObject = stream;
  }, []);

  return <video key={stream.id} ref={videoRef} muted autoPlay />;
}

export default function Room() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamList, setStreamList] = useState<StreamObject[]>([]);
  const { roomId } = useParams();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
      })
      .then((video) => {
        (videoRef.current as HTMLVideoElement).srcObject = video;
        streamModel.subscribe(() => {
          setStreamList(() => streamModel.getStream());
        });
        const socket = createSocket(video);
        socket.connect();
        socket.emit(SOCKET_EMIT_EVENT.JOIN_ROOM, {
          room: roomId,
        });
      });
  }, []);

  return (
    <div>
      <video ref={videoRef} muted autoPlay />
      {streamList.map(({ id, stream }) => {
        return <StreamVideo key={id} stream={stream} />;
      })}
    </div>
  );
}
