import MediaControlButton from '../common/MediaControlButton';

export default function VideoControlButton({ stream }: { stream: MediaStream }) {
  return (
    <MediaControlButton
      stream={stream}
      kind="video"
      className="p-3 border-2 border-white border-solid rounded-full w-[72px] tablet:w-14 hover:opacity-50"
      color="white"
    />
  );
}
