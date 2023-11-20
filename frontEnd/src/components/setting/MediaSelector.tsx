export default function MediaSelector({
  stream,
  optionsData,
  setFunc,
}: {
  stream: MediaStream;
  optionsData: MediaDeviceInfo[];
  setFunc: React.Dispatch<React.SetStateAction<string>>;
}) {
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFunc(e.target.value);
  };
  return (
    <select className="w-[33%] font-Pretendard text-xl" onChange={onChange}>
      {optionsData?.map((device) => {
        const isSelected = stream.getTracks().find((track) => track.label === device.label);
        if (isSelected)
          return (
            <option key={device.label} value={device.deviceId} selected className="font-Pretendard">
              {device.label}
            </option>
          );

        return (
          <option key={device.label} value={device.deviceId} className="font-Pretendard">
            {device.label}
          </option>
        );
      })}
    </select>
  );
}
