import { useEffect, useState, useRef } from 'react';
import * as Y from 'yjs';
import LineNumber from './LineNumber';
import InputArea from './InputArea';
import EditorButton from './EditorButton';
import SaveButton from './SaveButton';

export default function Editor({ dataChannels }: { dataChannels: Array<{ id: string; dataChannel: RTCDataChannel }> }) {
  const [plainCode, setPlainCode] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [execResult, setExecResult] = useState<string>(
    'successsuccesssuccesssuccesssuccesssuccesssuccesssuccesssuccesssuccesssuccesssuccesssuccesssuccesssuccesssuccesssuccesssuccesssuccesssuccesssuccesssuccesssuccesssuccesssuccesssuccess',
  );

  const ydoc = useRef(new Y.Doc());
  const ytext = useRef(ydoc.current.getText('sharedText'));

  const handleMessage = (event: MessageEvent) => {
    Y.applyUpdate(ydoc.current, new Uint8Array(event.data));

    setPlainCode(ytext.current.toString());
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    ytext.current.delete(0, ytext.current.length);
    ytext.current.insert(0, event.target.value);

    setPlainCode(event.target.value);
  };

  const handleSaveLocal = () => {
    const element = document.createElement('a');
    const file = new Blob([plainCode], { type: 'text/plain' });
    const fileURL = URL.createObjectURL(file);

    element.href = fileURL;
    element.download = 'solution.py';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
    URL.revokeObjectURL(fileURL);
  };

  const handleClear = () => {
    ytext.current.delete(0, ytext.current.length);

    setPlainCode('');
  };

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
    <div className="w-full h-full rounded-lg bg-mainColor font-Pretendard min-w-[400px] min-h-[400px]">
      <div className="min-h-[5%]">
        <h1 className="p-2 text-white border-b border-white text-[2vh]">Solution.py</h1>
      </div>
      <div className="flex flex-col min-h-[65%] overflow-y-auto custom-scroll">
        <div className="flex flex-grow">
          <div className="w-10 py-2 pr-2 overflow-hidden border-r border-white">
            <LineNumber plainCode={plainCode} />
          </div>
          <InputArea plainCode={plainCode} handleChange={handleChange} />
        </div>
      </div>
      <div className="flex flex-col min-h-[30%]">
        <div className="flex-grow">
          <div className="p-2 text-white border-white border-y">OUTPUT</div>
          <textarea
            disabled
            value={execResult}
            className="w-full p-2 text-white border-b border-white resize-none bg-mainColor custom-scroll"
          />
        </div>
        <div className="flex justify-end gap-2 px-2 py-1 h-fit">
          {/* TODO: 클라우드 저장 핸들러 추가 */}
          <SaveButton handleSaveLocal={handleSaveLocal} handleSaveCloud={() => {}} />
          <EditorButton onClick={handleClear}>초기화</EditorButton>
          {/* TODO: 클라우드 저장 핸들러 추가 */}
          <EditorButton onClick={() => {}}>실행하기</EditorButton>
        </div>
      </div>
    </div>
  );
}
