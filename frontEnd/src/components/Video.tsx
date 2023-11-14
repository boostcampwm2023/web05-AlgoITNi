import { useEffect, useRef } from 'react';

export default function Video({ stream }: { stream: MediaStream }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    videoRef.current.srcObject = stream;
  }, [stream]);

  return <video key={stream.id} ref={videoRef} muted autoPlay className="w-full rounded-3xl" />;
}
