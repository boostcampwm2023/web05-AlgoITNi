import { useState } from 'react';
import InputArea from './InputArea';
import LineNumber from './LineNumber';
import { EDITOR_TAB_SIZE } from '@/constants/editor';
import { LanguageInfo } from '@/types/editor';

interface EditorProps {
  plainCode: string;
  languageInfo: LanguageInfo;
  setPlainCode: React.Dispatch<React.SetStateAction<string>>;
}

export default function Editor({ plainCode, languageInfo, setPlainCode }: EditorProps) {
  const [cursorPosition, setCursorPosition] = useState<number>(0);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
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

  return (
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
  );
}
