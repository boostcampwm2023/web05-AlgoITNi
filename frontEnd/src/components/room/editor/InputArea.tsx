import { useEffect, useRef, useState } from 'react';
import dompurify from 'dompurify';
import highlightCode from '@/utils/highlightCode';

export default function InputArea({
  plainCode,
  cursorPosition,
  handleChange,
  handleKeyDown,
  handleClick,
  codeLanguage,
}: {
  plainCode: string;
  cursorPosition: number;
  handleChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement>;
  handleClick: React.MouseEventHandler<HTMLTextAreaElement>;
  codeLanguage: string;
}) {
  const [highlightedCode, setHighlightedCode] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  const handleScroll = (event: React.UIEvent<HTMLPreElement | HTMLTextAreaElement>) => {
    if (!preRef.current || !textareaRef.current) return;

    if (event.target === textareaRef.current) preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    else textareaRef.current.scrollLeft = preRef.current.scrollLeft;
  };

  useEffect(() => {
    setHighlightedCode(highlightCode(codeLanguage, plainCode));

    if (textareaRef.current) {
      textareaRef.current.selectionStart = cursorPosition;
      textareaRef.current.selectionEnd = cursorPosition;
    }
  }, [plainCode]);

  useEffect(() => {
    setHighlightedCode(highlightCode(codeLanguage, plainCode));
  }, [codeLanguage]);

  return (
    <div className="relative w-full h-full font-normal">
      <textarea
        onScroll={handleScroll}
        ref={textareaRef}
        value={plainCode}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        className="z-10 absolute w-full tracking-[3px] h-full p-2 pb-0 leading-7 overflow-hidden overflow-x-scroll text-base bg-transparent text-transparent resize-none caret-white custom-scroll whitespace-nowrap focus:outline-none"
      />
      <pre onScroll={handleScroll} className="absolute top-0 left-0 z-0 w-full h-full p-2 overflow-hidden" ref={preRef}>
        <code
          className="tracking-[3px] text-white text-base leading-7 w-full h-full text-ellipsis"
          dangerouslySetInnerHTML={{ __html: dompurify.sanitize(highlightedCode) }}
        />
      </pre>
    </div>
  );
}
