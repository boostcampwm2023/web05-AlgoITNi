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
    <div className="flex w-screen h-screen gap-4 p-2 bg-base">
      <div className="flex flex-col w-3/4 h-full gap-4">
        <div className=" flex min-h-[25%] w-full">
          <VideoSection mediaObject={mediaObject} streamList={streamList} />
        </div>
        <div className="flex w-full gap-4 overflow-auto h-3/4">
          <div className="flex flex-col w-2/5 h-full gap-4">
            <QuizViewSection />
            <ControllSection mediaObject={mediaObject} />
          </div>
          <div className="w-3/5 max-h-full">
            <EditorSection defaultCode={defaultCode} />
          </div>
        </div>
      </div>
      <div className="flex w-1/4 ">
        <ChattingSection />
      </div>
    </div>
  );
}
