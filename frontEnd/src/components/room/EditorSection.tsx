import Editor from '../Editor';

export default function EditorSection({
  dataChannels,
}: {
  dataChannels: {
    id: string;
    dataChannel: RTCDataChannel;
  }[];
}) {
  return (
    <div className="basis-3/5">
      <div className="w-full h-full">
        <Editor dataChannels={dataChannels} />
      </div>
    </div>
  );
}
