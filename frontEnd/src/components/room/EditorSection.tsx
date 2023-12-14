import { useContext, useEffect, useState } from 'react';
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
import { VITE_CODE_RUNNING_SOCKET_URL } from '@/constants/env';
import { RunCodeResponse } from '@/types/runCode';
import getOutputString from '@/utils/getOutputString';
import Section from '../common/SectionWrapper';
import Spinner from '../common/Spinner';
import { CRDTContext, CRDTProvider } from '@/contexts/crdt';
import useDataChannels from '@/stores/useDataChannels';

interface EditorSectionProps {
  defaultCode: string | null;
}

let executionSocket: Socket;

export default function EditorSection({ defaultCode }: EditorSectionProps) {
  const [fileName, setFileName] = useState<string>('');

  const [plainCode, setPlainCode] = useState<string>(defaultCode || '');
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const [languageName, setLanguageName] = useState<string>(EDITOR_DEFAULT_LANGUAGE);

  const [execResult, setExecResult] = useState<string>('');
  const [isExec, setIsExec] = useState<boolean>(false);

  const { codeDataChannel, languageDataChannel } = useDataChannels();

  const languageInfo = EDITOR_LANGUAGE_TYPES[languageName];

  const crdt = useContext(CRDTContext);

  useEffect(() => {
    localStorage.removeItem('code');
  }, []);

  const handleRecieveCodeMessage = (event: MessageEvent) => {
    const relPos = crdt.getRelativePosition(cursorPosition);

    const update = new Uint8Array(event.data);
    crdt.update(update);

    const updatedText = crdt.toString();
    setPlainCode(updatedText);

    const pos = crdt.getAbsolutePosition(relPos);
    if (pos) setCursorPosition(pos.index);
  };

  const handleRecieveLanguageMessage = (event: MessageEvent) => {
    setLanguageName(event.data);
  };

  const clearEditor = () => {
    crdt.delete(0, crdt.toString().length);
    sendMessageDataChannels(codeDataChannel, crdt.encodeData());
  };

  const handleClear = () => {
    setPlainCode('');
    clearEditor();
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

  useDataChannelOnMessage(codeDataChannel, handleRecieveCodeMessage);
  useDataChannelOnMessage(languageDataChannel, handleRecieveLanguageMessage);

  useEffect(() => {
    sendMessageDataChannels(languageDataChannel, languageName);
  }, [languageName]);

  return (
    <CRDTProvider>
      <Section>
        <div className="w-full h-full grid grid-rows-[repeat(12,minmax(0,1fr))] rounded-lg bg-primary">
          <div className="flex items-center justify-between h-full row-span-1 p-2 px-4 border-b">
            <EditorFileName>{fileName}</EditorFileName>
            <LanguageTypeDropDown languageName={languageName} setLanguageName={setLanguageName} />
          </div>
          <div className="flex flex-col overflow-y-auto row-[span_7_/_span_7] custom-scroll">
            <Editor
              plainCode={plainCode}
              languageInfo={languageInfo}
              setPlainCode={setPlainCode}
              cursorPosition={cursorPosition}
              setCursorPosition={setCursorPosition}
            />
          </div>
          <div className="row-span-3">
            <OutputArea execResult={execResult} />
          </div>
          <div className="flex items-center justify-between row-span-1 gap-2 p-[1vh]">
            <div className="h-full">
              <LoadButton plainCode={plainCode} setPlainCode={setPlainCode} setLanguageName={setLanguageName} setFileName={setFileName} />
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
    </CRDTProvider>
  );
}
