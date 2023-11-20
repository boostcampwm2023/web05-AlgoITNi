import { useEffect, useState, useRef } from 'react';
import dompurify from 'dompurify';
import hljs from 'highlight.js';
import * as Y from 'yjs';

export default function Editor({ dataChannels }: { dataChannels: Array<{ id: string; dataChannel: RTCDataChannel }> }) {
  const sanitizer = dompurify.sanitize;
  const [plainCode, setPlainCode] = useState<string>('');
  const [highlightedCode, setHighlightedCode] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

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

  const handleScroll = (event: React.UIEvent<HTMLPreElement | HTMLTextAreaElement>) => {
    if (!preRef.current || !textareaRef.current) return;

    if (event.target === textareaRef.current) preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    else textareaRef.current.scrollLeft = preRef.current.scrollLeft;
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

  const handleResetButton = () => {
    ytext.current.delete(0, ytext.current.length);

    setPlainCode('');
  };

  useEffect(() => {
    dataChannels.forEach(({ dataChannel }) => {
      dataChannel.onmessage = handleMessage;
    });
  }, [dataChannels]);

  useEffect(() => {
    setHighlightedCode(hljs.highlight(plainCode, { language: 'python' }).value.replace(/" "/g, '&nbsp; '));

    dataChannels.forEach(({ dataChannel }) => {
      if (dataChannel.readyState === 'open') dataChannel.send(Y.encodeStateAsUpdate(ydoc.current) as Uint8Array);
    });
  }, [plainCode]);

  return (
    <div className="w-full h-full rounded-lg bg-mainColor font-Pretendard">
      <h1 className="p-2 text-white border-b border-white h-[5%] text-xs">Solution.py</h1>
      <div className="flex flex-col h-[65%] overflow-y-auto custom-scroll">
        <div className="flex flex-grow">
          <div className="w-10 py-2 pr-2 overflow-hidden border-r border-white">
            {plainCode.split('\n').map((_, index) => (
              <div key={index} className="flex justify-end">
                <span className="leading-7 text-gray-400">{index + 1}</span>
              </div>
            ))}
          </div>
          <div className="relative w-full h-full">
            <textarea
              onScroll={handleScroll}
              ref={textareaRef}
              value={plainCode}
              onChange={handleChange}
              className="z-10 absolute w-full tracking-[3px] h-full p-2 pb-0 leading-7 overflow-hidden overflow-x-scroll text-transparent bg-transparent resize-none caret-white custom-scroll whitespace-nowrap focus:outline-none bg-mainColor"
            />
            <pre onScroll={handleScroll} className="absolute top-0 left-0 z-0 w-full h-full p-2 overflow-hidden" ref={preRef}>
              <code
                className="tracking-[3px] text-white font-Pretendard leading-7 w-full h-full text-ellipsis"
                dangerouslySetInnerHTML={{ __html: sanitizer(highlightedCode) }}
              />
            </pre>
          </div>
        </div>
      </div>
      <div className="flex flex-col h-[30%]">
        <div className="p-2 text-white border-white border-y">OUTPUT</div>
        <textarea disabled className="flex-grow h-10 p-2 text-white border-b border-white resize-none bg-mainColor" />
        <div className="flex justify-end gap-2 px-2 py-1 h-fit">
          <div className="relative">
            <div className="peer flex items-center justify-center px-4 py-2 text-xs bg-[#132A37] font-thin text-white rounded">
              저장하기
            </div>
            <div className="absolute z-10 items-center justify-between hidden gap-2 p-2 -translate-x-1/2 rounded-lg bg-[#132A37] left-1/2 -top-12 peer-hover:flex hover:flex">
              <button
                type="button"
                onClick={handleSaveLocal}
                className="flex items-center justify-center w-32 px-4 py-2 text-sm text-white duration-300 rounded-lg hover:text-black hover:bg-backgroundColor whitespace-nowrap"
              >
                다른 이름으로 저장
              </button>
              <button
                type="button"
                className="flex items-center justify-center w-32 px-4 py-2 text-sm text-white duration-300 rounded-lg hover:text-black hover:bg-backgroundColor whitespace-nowrap"
              >
                클라우드에 저장
              </button>
            </div>
          </div>
          <button
            type="button"
            className="flex items-center justify-center px-4 py-2 text-xs bg-[#132A37] font-thin text-white rounded"
            onClick={handleResetButton}
          >
            초기화
          </button>
          <button type="button" className="flex items-center justify-center px-4 py-2 text-xs bg-[#132A37] font-thin text-white rounded">
            코드 실행
          </button>
        </div>
      </div>
    </div>
  );
}
