import Editor from './editor/Editor';

export default function EditorSection({
  defaultCode,
  codeDataChannels,
  languageDataChannels,
}: {
  defaultCode: string | null;
  codeDataChannels: {
    id: string;
    dataChannel: RTCDataChannel;
  }[];
  languageDataChannels: {
    id: string;
    dataChannel: RTCDataChannel;
  }[];
}) {
  return (
    <div className="basis-3/5">
      <div className="w-full h-full">
        <Editor defaultCode={defaultCode} codeDataChannels={codeDataChannels} languageDataChannels={languageDataChannels} />
      </div>
    </div>
  );
}
