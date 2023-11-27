import Editor from './editor/Editor';

export default function EditorSection({
  defaultCode,
  codeDataChannels,
}: {
  defaultCode: string | null;
  codeDataChannels: {
    id: string;
    dataChannel: RTCDataChannel;
  }[];
}) {
  return (
    <div className="basis-3/5">
      <div className="w-full h-full">
        <Editor defaultCode={defaultCode} codeDataChannels={codeDataChannels} />
      </div>
    </div>
  );
}
