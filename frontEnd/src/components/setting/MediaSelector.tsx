export default function MediaSelector({
  optionsData,
  setFunc,
  className,
}: {
  optionsData: MediaDeviceInfo[];
  setFunc: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
}) {
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFunc(e.target.value);
  };
  return (
    <select className={className} onChange={onChange}>
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
