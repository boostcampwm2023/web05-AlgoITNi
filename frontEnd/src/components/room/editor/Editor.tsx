import { useEffect, useState, useRef } from 'react';
import * as Y from 'yjs';
import LineNumber from './LineNumber';
import InputArea from './InputArea';
import EditorButton from './EditorButton';
import SaveButton from './SaveButton';
import OutputArea from './OutputArea';
import { EDITOR_TAB_SIZE } from '@/constants/env';
import { uploadLocalFile } from '@/utils/file';

export default function Editor({ dataChannels }: { dataChannels: Array<{ id: string; dataChannel: RTCDataChannel }> }) {
  const [plainCode, setPlainCode] = useState<string>('');
  // TODO: 코드 실행 요청 후 결과 setState 추가
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [execResult] = useState<string>('');
  const [cursorPosition, setCursorPosition] = useState<number>(0);

  const ydoc = useRef(new Y.Doc());
  const ytext = useRef(ydoc.current.getText('sharedText'));

  const handleMessage = (event: MessageEvent) => {
    Y.applyUpdate(ydoc.current, new Uint8Array(event.data));

    setPlainCode(ytext.current.toString());
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

  const handleUploadLocalCodeFile = () => {
    uploadLocalFile((result) => setPlainCode(result));
  };

  const handleClear = () => {
    ytext.current.delete(0, ytext.current.length);

    setPlainCode('');
  };

  // TODO: 코드 실행 핸들러 추가
  const handleExecCode = () => {};

  useEffect(() => {
    dataChannels.forEach(({ dataChannel }) => {
      dataChannel.onmessage = handleMessage;
    });
  }, [dataChannels]);

  useEffect(() => {
    dataChannels.forEach(({ dataChannel }) => {
      if (dataChannel.readyState === 'open') dataChannel.send(Y.encodeStateAsUpdate(ydoc.current) as Uint8Array);
    });
  }, [plainCode]);

  return (
    <div className="w-full h-full grid grid-rows-[repeat(12,minmax(0,1fr))] rounded-lg bg-mainColor font-Pretendard min-w-[400px] min-h-[400px]">
      <div className="flex items-center justify-start h-full row-span-1 p-2 border-b border-white">
        <h1 className="text-white text-[max(2vh,15px)]">Solution.py</h1>
      </div>
      <div className="flex flex-col overflow-y-auto row-[span_7_/_span_7] custom-scroll">
        <div className="flex flex-grow">
          <div className="w-10 py-2 pr-2 overflow-hidden border-r border-white">
            <LineNumber plainCode={plainCode} />
          </div>
          <InputArea
            plainCode={plainCode}
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
          <EditorButton onClick={handleUploadLocalCodeFile}>로컬 파일 업로드</EditorButton>
        </div>
        <div className="flex h-full gap-2">
          <SaveButton plainCode={plainCode} />
          <EditorButton onClick={handleClear}>초기화</EditorButton>
          <EditorButton onClick={handleExecCode}>실행하기</EditorButton>
        </div>
      </div>
    </div>
  );
}
