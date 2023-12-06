import MediaControlButton from '../common/MediaControlButton';

export default function VideoControlButton({ stream }: { stream: MediaStream }) {
  return (
    <MediaControlButton
      stream={stream}
      kind="video"
      className="w-[5vw] p-[1vw] hover:opacity-50 border-solid border-[1px] rounded-[50%] border-white"
    />
  );
}
