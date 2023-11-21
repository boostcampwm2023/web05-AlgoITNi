export default function MediaSelector({
  optionsData,
  setFunc,
}: {
  optionsData: MediaDeviceInfo[];
  setFunc: React.Dispatch<React.SetStateAction<string>>;
}) {
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFunc(e.target.value);
  };
  return (
    <select className="w-[33%] font-Pretendard text-xl" onChange={onChange}>
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
