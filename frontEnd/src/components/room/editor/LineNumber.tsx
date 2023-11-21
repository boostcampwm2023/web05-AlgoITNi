export default function LineNumber({ plainCode }: { plainCode: string }) {
  return (
    <>
      {plainCode.split('\n').map((_, index) => (
        <div key={index} className="flex justify-end">
          <span className="leading-7 text-gray-400">{index + 1}</span>
        </div>
      ))}
    </>
  );
}
