import { RTCConnectionList, createSocket } from '@/services/Socket';
import { useEffect, useRef } from 'react';

function StreamVideo({ stream }: { stream: MediaStream }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    (videoRef.current as HTMLVideoElement).srcObject = stream;
  }, []);

  return <video ref={videoRef}></video>;
}

export default function Room() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
      })
      .then((video) => {
        (videoRef.current as HTMLVideoElement).srcObject = video;
        createSocket(video);
      });
  }, []);

  return (
    <div>
      <video ref={videoRef} muted autoPlay></video>
      {Object.entries(RTCConnectionList).map(([key, value]) => value.stream && <StreamVideo key={key} stream={value.stream} />)}
    </div>
  );
}
