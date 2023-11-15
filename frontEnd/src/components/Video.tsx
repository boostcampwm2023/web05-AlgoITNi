import { useEffect, useRef } from 'react';

export default function Video({ stream, muted = false }: { stream: MediaStream; muted?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    videoRef.current.srcObject = stream;
  }, [stream]);

  return (
    <video ref={videoRef} autoPlay className="w-full rounded-3xl" playsInline muted={muted}>
      <track kind="captions" />
    </video>
  );
}
