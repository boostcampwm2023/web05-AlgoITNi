export default function OutputArea({ execResult }: { execResult: string }) {
  return (
    <div className="flex flex-col h-full border-y">
      <div className="p-2  text-[max(1.5vh,12px)] border-b">OUTPUT</div>
      <textarea disabled value={execResult} className="flex-grow w-full p-4 text-sm resize-none bg-primary custom-scroll" />
    </div>
  );
}
