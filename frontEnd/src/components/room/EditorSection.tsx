import Editor from './editor/Editor';

export default function EditorSection({
  defaultCode,
  dataChannels,
}: {
  defaultCode: string | null;
  dataChannels: {
    id: string;
    dataChannel: RTCDataChannel;
  }[];
}) {
  return (
    <div className="basis-3/5">
      <div className="w-full h-full">
        <Editor defaultCode={defaultCode} dataChannels={dataChannels} />
      </div>
    </div>
  );
}
