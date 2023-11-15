import { useEffect, useState, useRef } from 'react';
import dompurify from 'dompurify';
import hljs from 'highlight.js';

export default function Editor({ value, onChange }: { value: string; onChange: React.ChangeEventHandler<HTMLTextAreaElement> }) {
  const sanitizer = dompurify.sanitize;
  const [highlightedHTML, setHighlightedCode] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    setHighlightedCode(hljs.highlight(value, { language: 'python' }).value.replace(/" "/g, '&nbsp; '));
  }, [value]);

  const handleScroll = (event: React.UIEvent<HTMLPreElement | HTMLTextAreaElement>) => {
    if (!preRef.current || !textareaRef.current) return;

    if (event.target === textareaRef.current) preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    else textareaRef.current.scrollLeft = preRef.current.scrollLeft;
  };

  return (
    <div className="w-full h-full rounded-lg bg-mainColor font-Pretendard">
      <h1 className="p-2 text-white border-b border-white h-[5%] text-xs">Solution.py</h1>
      <div className="flex flex-col h-[65%] overflow-y-auto custom-scroll">
        <div className="flex flex-grow">
          <div className="w-10 py-2 pr-2 overflow-hidden border-r border-white">
            {value.split('\n').map((_, index) => (
              <div key={index} className="flex justify-end">
                <span className="leading-7 text-gray-400">{index + 1}</span>
              </div>
            ))}
          </div>
          <div className="relative w-full h-full">
            <textarea
              onScroll={handleScroll}
              ref={textareaRef}
              value={value}
              onChange={onChange}
              autoComplete="false"
              spellCheck="false"
              className="z-10 absolute w-full tracking-[3px] h-full p-2 pb-0 leading-7 overflow-hidden overflow-x-scroll text-transparent bg-transparent resize-none caret-white custom-scroll whitespace-nowrap focus:outline-none bg-mainColor"
            />
            <pre onScroll={handleScroll} className="absolute top-0 left-0 z-0 w-full h-full p-2 overflow-hidden" ref={preRef}>
              <code
                className="tracking-[3px] text-white font-Pretendard leading-7 w-full h-full text-ellipsis"
                dangerouslySetInnerHTML={{ __html: sanitizer(highlightedHTML) }}
              />
            </pre>
          </div>
        </div>
      </div>
      <div className="flex flex-col h-[30%]">
        <div className="p-2 text-white border-white border-y">OUTPUT</div>
        <textarea disabled className="flex-grow h-10 p-2 text-white border-b border-white resize-none bg-mainColor" />
        <div className="flex justify-end gap-2 px-2 py-1 h-fit">
          <button type="button" className="flex items-center justify-center px-4 py-2 text-xs bg-[#132A37] font-thin text-white rounded">
            저장하기
          </button>
          <button type="button" className="flex items-center justify-center px-4 py-2 text-xs bg-[#132A37] font-thin text-white rounded">
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
