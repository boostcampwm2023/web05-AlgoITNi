import { useContext } from 'react';
import InputArea from './InputArea';
import LineNumber from './LineNumber';
import { EDITOR_TAB_SIZE } from '@/constants/editor';
import { LanguageInfo } from '@/types/editor';
import sendMessageDataChannels from '@/utils/sendMessageDataChannels';
import { CRDTContext } from '@/contexts/crdt';
import useDataChannels from '@/stores/useDataChannels';

interface EditorProps {
  plainCode: string;
  languageInfo: LanguageInfo;
  setPlainCode: React.Dispatch<React.SetStateAction<string>>;
  cursorPosition: number;
  setCursorPosition: React.Dispatch<React.SetStateAction<number>>;
}

export default function Editor({ plainCode, languageInfo, setPlainCode, cursorPosition, setCursorPosition }: EditorProps) {
  const { codeDataChannel } = useDataChannels();

  const crdt = useContext(CRDTContext);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    const newCursor = event.target.selectionStart; // 연산 이후의 최종 위치

    setPlainCode(newText);
    setCursorPosition(newCursor);

    const changedLength = plainCode.length - newText.length;
    const isAdded = changedLength < 0;

    if (isAdded) {
      const addedText = newText.slice(newCursor - Math.abs(changedLength), newCursor);
      const isOneLetter = addedText.length === 1;
      const isKorean = addedText.match(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/);

      if (isOneLetter && isKorean) return;

      crdt.insert(newCursor - Math.abs(changedLength), addedText);
    } else {
      const removedLength = Math.abs(changedLength);
      crdt.delete(newCursor, removedLength);
    }

    sendMessageDataChannels(codeDataChannel, crdt.encodeData());
  };

  const handleClick = (event: React.MouseEvent<HTMLTextAreaElement>) => {
    setCursorPosition((event.target as EventTarget & HTMLTextAreaElement).selectionStart);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const { selectionStart } = event.target as EventTarget & HTMLTextAreaElement;
    setCursorPosition(selectionStart);

    if (event.key === 'Tab') {
      event.preventDefault();

      crdt.insert(selectionStart, '    ');
      sendMessageDataChannels(codeDataChannel, crdt.encodeData());

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
