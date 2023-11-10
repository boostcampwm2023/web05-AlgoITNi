import { useEffect, useRef, useState } from 'react';
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
  const [stream, setStream] = useState<StreamObject[]>([]);
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
      })
      .then((video) => {
        (videoRef.current as HTMLVideoElement).srcObject = video;
        streamModel.subscribe(() => {
          setStream(() => streamModel.getStream());
        });
        const socket = createSocket(video);
        socket.connect();
        socket.emit(SOCKET_EMIT_EVENT.JOIN_ROOM, {
          room: '1234',
        });
      });
  }, []);

  return (
    <div>
      <video ref={videoRef} muted autoPlay />
      {stream.map((item) => {
        return <StreamVideo key={item.id} stream={item.stream} />;
      })}
    </div>
  );
}
