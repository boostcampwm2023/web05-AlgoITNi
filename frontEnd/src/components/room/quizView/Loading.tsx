export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full px-12 border rounded-md shadow mx4-auto bg-primary">
      <div className="flex flex-col justify-center w-full">
        <div className="flex flex-col justify-center gap-8 animate-pulse">
          <div className="h-3 rounded bg-slate-200" />
          <div className="flex-1 py-1 space-y-6">
            <div className="h-3 rounded bg-slate-200" />
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-3 col-span-2 rounded bg-slate-200" />
                <div className="h-3 col-span-1 rounded bg-slate-200" />
              </div>
              <div className="h-3 rounded bg-slate-200" />
              <div className="h-3 rounded bg-slate-200" />
            </div>
            <div className="h-3 rounded bg-slate-200" />
            <div className="grid grid-cols-3 gap-4">
              <div className="h-3 col-span-1 rounded bg-slate-200" />
              <div className="h-3 col-span-2 rounded bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
