import { useState } from 'react';
import { useParams } from 'react-router-dom';
import useRTCConnection from '@/hooks/useRTCConnection';
import Setting from '@/components/setting/Settings';
import useMedia from '@/hooks/useMedia';
import VideoSection from '@/components/room/VideoSection';
import QuizViewSection from '@/components/room/QuizViewSection';
import EditorSection from '@/components/room/EditorSection';
import ChattingSection from '@/components/room/ChattingSection';
import ControllSection from '@/components/room/ControllSection';

export default function Room() {
  const defaultCode = localStorage.getItem('code');
  const { roomId } = useParams();
  const mediaObject = useMedia();
  const [isSetting, setSetting] = useState(!!defaultCode || defaultCode === '');
  const { streamList, dataChannels } = useRTCConnection(roomId as string, mediaObject.stream as MediaStream, isSetting);

  if (!isSetting) return <Setting mediaObject={mediaObject} setSetting={setSetting} />;

  return (
    <div className="flex flex-col h-screen p-4">
      <div className="flex h-full gap-4">
        <div className="flex flex-col h-full gap-4 basis-9/12">
          <div className="flex basis-3/12">
            <VideoSection mediaObject={mediaObject} streamList={streamList} />
          </div>
          <div className="flex h-full gap-4 basis-9/12">
            <div className="flex flex-col w-full h-full gap-4 basis-2/5">
              <QuizViewSection />
              <ControllSection mediaObject={mediaObject} />
            </div>
            <EditorSection defaultCode={defaultCode} dataChannels={dataChannels} />
          </div>
        </div>
        <div className="flex basis-3/12">
          <ChattingSection roomId={roomId as string} nickname="춘식이" />
        </div>
      </div>
    </div>
  );
}
