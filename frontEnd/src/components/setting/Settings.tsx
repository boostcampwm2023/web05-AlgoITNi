import { MediaObject } from '@/hooks/useMedia';
import SettingVideo from './SettingVideo';
import Header from '../common/Header';
import UserInputArea from './UserInputArea';

export default function Setting({ mediaObject }: { mediaObject: MediaObject }) {
  return (
    <div className="min-h-screen min-w-screen bg-base">
      <Header />
      <main className="flex px-[7vw] gap-10 tablet:flex-col">
        <div className="basis-7/12">
          <SettingVideo mediaObject={mediaObject} />
        </div>
        <div className="flex flex-col items-center justify-center px-10 my-10 basis-5/12 tablet:px-0 mobile:px-0">
          <div className="flex flex-col items-start justify-center w-full gap-12">
            <h2 className="text-5xl font-light whitespace-nowrap mobile:text-4xl">참여할 준비가 되셨나요?</h2>
            <UserInputArea />
          </div>
        </div>
      </main>
    </div>
  );
}
