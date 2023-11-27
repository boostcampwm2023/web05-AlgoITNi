import { MediaObject } from '@/hooks/useMedia';
import MediaControlButton from '../common/MediaControlButton';
import settingIcon from '@/assets/setting.svg';
import SettingModal from './modal/SettingModal';
import useModal from '@/hooks/useModal';

export default function ControllSection({ mediaObject }: { mediaObject: MediaObject }) {
  const { stream } = mediaObject;
  const { show } = useModal(SettingModal);

  return (
    <div className="flex justify-between p-2 rounded-lg bg-secondary">
      <div className="flex gap-2">
        <MediaControlButton
          stream={stream as MediaStream}
          kind="mic"
          className="w-[3vw] p-[1vw] hover:opacity-50 rounded-[15px] border-white"
        />
        <MediaControlButton
          stream={stream as MediaStream}
          kind="video"
          className="w-[3vw] p-[1vw] hover:opacity-50 rounded-[15px] border-white"
        />
      </div>
      <button type="button" className="w-[3vw] p-[1vw] hover:opacity-50 rounded-[15px] border-white" onClick={() => show({ mediaObject })}>
        <img src={settingIcon} alt="setting" />
      </button>
    </div>
  );
}
