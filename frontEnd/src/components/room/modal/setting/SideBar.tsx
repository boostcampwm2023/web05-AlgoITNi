import { SettingType } from '@/types/settingModal';

export default function SideBar({
  settingType,
  setSettingType,
}: {
  settingType: SettingType;
  setSettingType: React.Dispatch<React.SetStateAction<SettingType>>;
}) {
  return (
    <div className="p-4 border-r-2 pr-11">
      <div className="mb-4 font-bold text-[1.8vw]">설정</div>
      <div className="flex flex-col gap-1 basis-1/4">
        <button
          type="button"
          className="flex justify-start w-full text-[1.5vw] "
          onClick={() => setSettingType('audio')}
          style={{
            fontWeight: settingType === 'audio' ? 700 : 400,
          }}
        >
          오디오
        </button>
        <button
          type="button"
          className="flex justify-start w-full text-[1.5vw] "
          onClick={() => setSettingType('video')}
          style={{
            fontWeight: settingType === 'video' ? 700 : 400,
          }}
        >
          영상
        </button>
      </div>
    </div>
  );
}
