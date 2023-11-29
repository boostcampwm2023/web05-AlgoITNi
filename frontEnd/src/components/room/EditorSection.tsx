import { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client/debug';
import { EDITOR_DEFAULT_LANGUAGE, EDITOR_LANGUAGE_TYPES } from '@/constants/editor';
import OutputArea from './editor/OutputArea';
import LoadButton from './editor/LoadButton';
import SaveButton from './editor/SaveButton';
import EditorButton from './editor/EditorButton';
import LanguageTypeDropDown from './editor/LanguageTypeDropDown';
import EditorFileName from './editor/EditorHeader';
import Editor from './editor/Editor';
import useDataChannelOnMessage from '@/hooks/useDataChannelOnMessage';
import sendMessageDataChannels from '@/utils/sendMessageDataChannels';
import { DataChannel } from '@/types/RTCConnection';
import postRunCode from '@/apis/postRunCode';
import { VITE_CODE_RUNNING_SOCKET_URL } from '@/constants/env';
import { RunCodeResponse } from '@/types/runCode';

interface EditorSectionProps {
  defaultCode: string | null;
  codeDataChannels: DataChannel[];
  languageDataChannels: DataChannel[];
}

let executionSocket: Socket;

export default function EditorSection({ defaultCode, codeDataChannels, languageDataChannels }: EditorSectionProps) {
  const [plainCode, setPlainCode] = useState<string>(defaultCode || '');
  const [execResult, setExecResult] = useState<string>('');
  const [languageName, setLanguageName] = useState<string>(EDITOR_DEFAULT_LANGUAGE);

  const languageInfo = EDITOR_LANGUAGE_TYPES[languageName];

  useEffect(() => {
    localStorage.removeItem('code');
  }, []);

  const handleRecieveCodeMessage = (event: MessageEvent<string>) => {
    setPlainCode(event.data);
  };

  const handleRecieveLanguageMessage = (event: MessageEvent) => {
    setLanguageName(event.data);
  };

  const handleClear = () => {
    setPlainCode('');

    // FIXME: 현재 state로 임시 CRDT 구현
    sendMessageDataChannels(codeDataChannels, '');
  };

  const handleExecCode = async () => {
    executionSocket = io(VITE_CODE_RUNNING_SOCKET_URL);

    executionSocket.on('done', (response: RunCodeResponse) => {
      setExecResult(`${response.message}\n\n${response.result}\n\n${response.timestamp}`);
      executionSocket.disconnect();
    });

    executionSocket.on('connect', () => postRunCode(executionSocket.id, plainCode, languageName));
  };

  useDataChannelOnMessage(codeDataChannels, handleRecieveCodeMessage);
  useDataChannelOnMessage(languageDataChannels, handleRecieveLanguageMessage);

  // TODO: CRDT 로직 추가
  // 현재는 state를 이용해 문자열이 중첩되는 문제만 해결한 상태

  useEffect(() => {
    sendMessageDataChannels(languageDataChannels, languageName);
  }, [languageName]);

  return (
    <div className="basis-3/5">
      <div className="w-full h-full grid grid-rows-[repeat(12,minmax(0,1fr))] rounded-lg bg-primary min-w-[400px] min-h-[400px]">
        <div className="flex items-center justify-between h-full row-span-1 p-2 px-4 border-b border-white">
          <EditorFileName>Solution.{languageInfo.extension}</EditorFileName>
          <LanguageTypeDropDown languageName={languageName} setLanguageName={setLanguageName} />
        </div>
        <div className="flex flex-col overflow-y-auto row-[span_7_/_span_7] custom-scroll">
          <Editor plainCode={plainCode} languageInfo={languageInfo} setPlainCode={setPlainCode} codeDataChannels={codeDataChannels} />
        </div>
        <div className="row-span-3">
          <OutputArea execResult={execResult} />
        </div>
        <div className="flex items-center justify-between row-span-1 gap-2 p-[1vh]">
          <div className="h-full">
            <LoadButton
              plainCode={plainCode}
              setPlainCode={setPlainCode}
              setLanguageName={setLanguageName}
              codeDataChannels={codeDataChannels}
            />
          </div>
          <div className="flex h-full gap-2">
            <SaveButton plainCode={plainCode} languageInfo={languageInfo} />
            <EditorButton onClick={handleClear}>초기화</EditorButton>
            <EditorButton onClick={handleExecCode}>실행하기</EditorButton>
          </div>
        </div>
      </div>
    </div>
  );
}
