import { useEffect, useState, useRef } from 'react';
import * as Y from 'yjs';
import LineNumber from './LineNumber';
import InputArea from './InputArea';
import EditorButton from './EditorButton';
import SaveButton from './SaveButton';
import OutputArea from './OutputArea';
import LoadButton from './LoadButton';
import { EDITOR_DEFAULT_LANGUAGE, EDITOR_LANGUAGE_TYPES, EDITOR_TAB_SIZE } from '@/constants/editor';
import { LanguageInfo } from '@/types/editor';

export default function Editor({
  defaultCode,
  codeDataChannels,
  languageDataChannels,
}: {
  defaultCode: string | null;
  codeDataChannels: Array<{ id: string; dataChannel: RTCDataChannel }>;
  languageDataChannels: Array<{ id: string; dataChannel: RTCDataChannel }>;
}) {
  const [plainCode, setPlainCode] = useState<string>(defaultCode || '');
  // TODO: 코드 실행 요청 후 결과 setState 추가
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [execResult] = useState<string>('');
  const [cursorPosition, setCursorPosition] = useState<number>(0);

  const [languageName, setLanguageName] = useState<string>(EDITOR_DEFAULT_LANGUAGE);
  const [languageInfo, setLanguageInfo] = useState<LanguageInfo>(EDITOR_LANGUAGE_TYPES[EDITOR_DEFAULT_LANGUAGE]);

  const ydoc = useRef(new Y.Doc());
  const ytext = useRef(ydoc.current.getText('sharedText'));

  useEffect(() => {
    localStorage.removeItem('code');
  }, []);

  const handleRecieveCodeMessage = (event: MessageEvent) => {
    Y.applyUpdate(ydoc.current, new Uint8Array(event.data));

    setPlainCode(ytext.current.toString());
  };

  const handleRecieveLanguageMessage = (event: MessageEvent) => {
    setLanguageName(event.data);
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    ytext.current.delete(0, ytext.current.length);
    ytext.current.insert(0, event.target.value);

    setCursorPosition(event.target.selectionStart);
    setPlainCode(event.target.value);
  };

  const handleClick = (event: React.MouseEvent<HTMLTextAreaElement>) => {
    setCursorPosition((event.target as EventTarget & HTMLTextAreaElement).selectionStart);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const { selectionStart } = event.target as EventTarget & HTMLTextAreaElement;
    setCursorPosition(selectionStart);

    if (event.key === 'Tab') {
      event.preventDefault();

      setCursorPosition((prev) => prev + EDITOR_TAB_SIZE);
      setPlainCode((prev) => `${prev.slice(0, selectionStart)}    ${prev.slice(selectionStart)}`);
    }
  };

  const handleClear = () => {
    ytext.current.delete(0, ytext.current.length);

    setPlainCode('');
  };

  // TODO: 코드 실행 핸들러 추가
  const handleExecCode = () => {};

  useEffect(() => {
    codeDataChannels.forEach(({ dataChannel }) => {
      dataChannel.onmessage = handleRecieveCodeMessage;
    });
  }, [codeDataChannels]);

  useEffect(() => {
    languageDataChannels.forEach(({ dataChannel }) => {
      dataChannel.onmessage = handleRecieveLanguageMessage;
    });
  }, [languageDataChannels]);

  useEffect(() => {
    codeDataChannels.forEach(({ dataChannel }) => {
      if (dataChannel.readyState === 'open') dataChannel.send(Y.encodeStateAsUpdate(ydoc.current) as Uint8Array);
    });
  }, [plainCode]);

  useEffect(() => {
    languageDataChannels.forEach(({ dataChannel }) => {
      if (dataChannel.readyState === 'open') dataChannel.send(languageName);
    });

    setLanguageInfo(EDITOR_LANGUAGE_TYPES[languageName]);
  }, [languageName]);

  return (
    <div className="w-full h-full grid grid-rows-[repeat(12,minmax(0,1fr))] rounded-lg bg-primary min-w-[400px] min-h-[400px]">
      <div className="flex items-center justify-between h-full row-span-1 p-2 border-b border-white">
        <h1 className="text-white text-[max(2vh,15px)]">Solution.{languageInfo.extension}</h1>
        <select name="language" onChange={(e) => setLanguageName(e.target.value)} value={languageName}>
          {Object.values(EDITOR_LANGUAGE_TYPES).map((languageData, index) => (
            <option key={index + languageData.name} value={languageData.name}>
              {languageData.optionText}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col overflow-y-auto row-[span_7_/_span_7] custom-scroll">
        <div className="flex flex-grow">
          <div className="w-10 py-2 pr-2 overflow-hidden border-r border-white">
            <LineNumber plainCode={plainCode} />
          </div>
          <InputArea
            plainCode={plainCode}
            languageInfo={languageInfo}
            cursorPosition={cursorPosition}
            handleChange={handleChange}
            handleKeyDown={handleKeyDown}
            handleClick={handleClick}
          />
        </div>
      </div>
      <div className="row-span-3">
        <OutputArea execResult={execResult} />
      </div>
      <div className="flex items-center justify-between row-span-1 gap-2 p-[1vh]">
        <div className="h-full">
          <LoadButton plainCode={plainCode} setPlainCode={setPlainCode} setLanguageName={setLanguageName} />
        </div>
        <div className="flex h-full gap-2">
          <SaveButton plainCode={plainCode} languageInfo={languageInfo} />
          <EditorButton onClick={handleClear}>초기화</EditorButton>
          <EditorButton onClick={handleExecCode}>실행하기</EditorButton>
        </div>
      </div>
    </div>
  );
}
