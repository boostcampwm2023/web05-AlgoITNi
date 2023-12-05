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
import { VITE_CODE_RUNNING_SOCKET_URL } from '@/constants/env';
import { RunCodeResponse } from '@/types/runCode';
import getOutputString from '@/utils/getOutputString';
import Section from '../common/SectionWrapper';
import Spinner from '../common/Spinner';

interface EditorSectionProps {
  defaultCode: string | null;
  codeDataChannels: DataChannel[];
  languageDataChannels: DataChannel[];
}

let executionSocket: Socket;

export default function EditorSection({ defaultCode, codeDataChannels, languageDataChannels }: EditorSectionProps) {
  const [fileName, setFileName] = useState<string>('');

  const [plainCode, setPlainCode] = useState<string>(defaultCode || '');
  const [languageName, setLanguageName] = useState<string>(EDITOR_DEFAULT_LANGUAGE);

  const [execResult, setExecResult] = useState<string>('');
  const [isExec, setIsExec] = useState<boolean>(false);

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

  const handleExecCode = () => {
    executionSocket = io(VITE_CODE_RUNNING_SOCKET_URL, { transports: ['websocket'] });

    executionSocket.on('done', (response: RunCodeResponse) => {
      setExecResult(getOutputString(response));
      setIsExec(false);

      executionSocket.disconnect();
    });

    executionSocket.on('connect', () => {
      setIsExec(true);
      setExecResult('');

      executionSocket.emit('request', { code: plainCode, language: languageName });
    });
  };

  useDataChannelOnMessage(codeDataChannels, handleRecieveCodeMessage);
  useDataChannelOnMessage(languageDataChannels, handleRecieveLanguageMessage);

  // TODO: CRDT 로직 추가
  // 현재는 state를 이용해 문자열이 중첩되는 문제만 해결한 상태

  useEffect(() => {
    sendMessageDataChannels(languageDataChannels, languageName);
  }, [languageName]);

  return (
    <Section>
      <div className="w-full h-full grid grid-rows-[repeat(12,minmax(0,1fr))] rounded-lg bg-primary">
        <div className="flex items-center justify-between h-full row-span-1 p-2 px-4 border-b">
          <EditorFileName>{fileName}</EditorFileName>
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
              setFileName={setFileName}
              codeDataChannels={codeDataChannels}
            />
          </div>
          <div className="flex h-full gap-2">
            <SaveButton plainCode={plainCode} languageInfo={languageInfo} fileName={fileName} setFileName={setFileName} />
            <EditorButton onClick={handleClear}>초기화</EditorButton>
            <EditorButton onClick={handleExecCode} disabled={isExec}>
              {isExec ? <Spinner /> : '실행하기'}
            </EditorButton>
          </div>
        </div>
      </div>
    </Section>
  );
}
