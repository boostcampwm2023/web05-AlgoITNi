import { useParams } from 'react-router-dom';
import useRTCConnection from '@/hooks/useRTCConnection';
import Setting from '@/components/setting/Settings';
import useMedia from '@/hooks/useMedia';
import VideoSection from '@/components/room/VideoSection';
import QuizViewSection from '@/components/room/QuizViewSection';
import EditorSection from '@/components/room/EditorSection';
import ChattingSection from '@/components/room/ChattingSection';
import ControllSection from '@/components/room/ControllSection';
import useRoomConfigData from '@/stores/useRoomConfigData';
import Modals from '@/components/modal/Modals';
import { CRDTProvider } from '@/contexts/crdt';

const defaultCode = localStorage.getItem('code');
const defaultNickName = localStorage.getItem('nickName');
const hasLogin = (!!defaultCode || defaultCode === '') && !!defaultNickName;

export default function Room() {
  const { roomId } = useParams();
  const mediaObject = useMedia();
  const isConnectionDone = useRoomConfigData((state) => state.isConnectionDone);

  const { streamList } = useRTCConnection(roomId as string, mediaObject.stream as MediaStream);
  if (!isConnectionDone && !hasLogin) return <Setting mediaObject={mediaObject} />;

  return (
    <CRDTProvider>
      <div className="flex h-screen min-w-full min-h-screen gap-4 p-2 overflow-hidden bg-base">
        <div className="flex flex-col w-3/4 h-full gap-4 tablet:flex-row tablet:w-full">
          <div className="flex w-full tablet:max-w-[250px] mobile:hidden">
            <VideoSection mediaObject={mediaObject} streamList={streamList} />
          </div>
          <div className="flex flex-grow w-full gap-4 max-h-[75%] tablet:h-full min-h-[500px] tablet:max-h-full">
            <div className="flex flex-col w-2/5 h-full gap-4 tablet:hidden">
              <QuizViewSection />
              <ControllSection mediaObject={mediaObject} />
            </div>
            <div className="w-3/5 max-h-full tablet:w-full tablet:h-full">
              <EditorSection defaultCode={defaultCode} />
            </div>
          </div>
        </div>
        <div className="flex w-1/4 h-full tablet:hidden min-h-[716px]">
          <ChattingSection />
        </div>
      </div>
      <Modals />
    </CRDTProvider>
  );
}
