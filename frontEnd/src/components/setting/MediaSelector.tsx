export default function MediaSelector({
  stream,
  optionsData,
  setFunc,
  className,
}: {
  stream: MediaStream;
  optionsData: MediaDeviceInfo[];
  setFunc: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
}) {
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFunc(e.target.value);
  };
  if (Object.keys(stream).length === 0) return <div />;

  const [videoTrack] = stream.getVideoTracks();
  const [audioTrack] = stream.getAudioTracks();
  const video = optionsData.find((option) => option.label === videoTrack.label);
  const audioInput = optionsData.find((option) => option.label === audioTrack.label);
  const value = video || audioInput;

  return (
    <select className={className} onChange={onChange} value={value?.deviceId}>
      {optionsData?.map((device) => {
        return (
          <option key={device.label} value={device.deviceId} className="font-Pretendard">
            {device.label}
          </option>
        );
      })}
    </select>
  );
}
