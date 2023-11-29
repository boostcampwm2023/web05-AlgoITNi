export default function OutputArea({ execResult }: { execResult: string }) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-2 text-white text-[max(1.5vh,12px)] border-white border-y">OUTPUT</div>
      <textarea
        disabled
        value={execResult}
        className="flex-grow w-full p-4 text-sm text-white border-b border-white resize-none bg-primary custom-scroll"
      />
    </div>
  );
}
