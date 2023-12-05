import * as Y from 'yjs';
import InputArea from './InputArea';
import LineNumber from './LineNumber';
import { EDITOR_TAB_SIZE } from '@/constants/editor';
import { LanguageInfo } from '@/types/editor';
import { DataChannel } from '@/types/RTCConnection';
import sendMessageDataChannels from '@/utils/sendMessageDataChannels';

interface EditorProps {
  plainCode: string;
  languageInfo: LanguageInfo;
  setPlainCode: React.Dispatch<React.SetStateAction<string>>;
  codeDataChannels: DataChannel[];
  Ydoc: React.MutableRefObject<Y.Doc>;
  cursorPosition: number;
  setCursorPosition: React.Dispatch<React.SetStateAction<number>>;
}

export default function Editor({
  plainCode,
  languageInfo,
  setPlainCode,
  codeDataChannels,
  Ydoc,
  cursorPosition,
  setCursorPosition,
}: EditorProps) {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    setPlainCode(newText);

    const newCursor = event.target.selectionStart; // 연산 이후의 최종 위치
    setCursorPosition(newCursor);

    const changedLength = plainCode.length - newText.length;

    // 추가된 경우
    if (changedLength < 0) {
      const addedText = newText.slice(newCursor - Math.abs(changedLength), newCursor);
      Ydoc.current.getText('sharedText').insert(newCursor - Math.abs(changedLength), addedText);
    } else {
      const removedLength = Math.abs(changedLength);
      Ydoc.current.getText('sharedText').delete(newCursor, removedLength);
    }

    sendMessageDataChannels(codeDataChannels, Y.encodeStateAsUpdate(Ydoc.current));
  };

  const handleClick = (event: React.MouseEvent<HTMLTextAreaElement>) => {
    setCursorPosition((event.target as EventTarget & HTMLTextAreaElement).selectionStart);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const { selectionStart } = event.target as EventTarget & HTMLTextAreaElement;
    setCursorPosition(selectionStart);

    if (event.key === 'Tab') {
      event.preventDefault();

      Ydoc.current.getText('sharedText').insert(selectionStart, '    ');
      sendMessageDataChannels(codeDataChannels, Y.encodeStateAsUpdate(Ydoc.current));

      setCursorPosition((prev) => prev + EDITOR_TAB_SIZE);
      setPlainCode((prev) => `${prev.slice(0, selectionStart)}    ${prev.slice(selectionStart)}`);
    }
  };

  return (
    <div className="flex flex-grow ">
      <div className="w-10 py-2 pr-2 overflow-hidden border-r ">
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
