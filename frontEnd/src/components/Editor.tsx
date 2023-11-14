export default function Editor({ value, onChange }: { value: string; onChange: React.ChangeEventHandler<HTMLTextAreaElement> }) {
  return (
    <div className="w-full h-full rounded-lg bg-mainColor font-Pretendard">
      <h1 className="p-2 text-white border-b border-white h-[5%] text-xs">Solution.py</h1>
      <div className="flex flex-col overflow-auto h-[65%] custom-scroll">
        <div className="flex flex-grow">
          <div className="w-10 py-2 pr-2 overflow-hidden border-r border-white">
            {value.split('\n').map((_, index) => (
              <div key={index} className="flex justify-end">
                <span className="leading-7 text-gray-400">{index + 1}</span>
              </div>
            ))}
          </div>
          <textarea
            value={value}
            onChange={onChange}
            className="w-full p-2 pb-0 overflow-hidden overflow-x-scroll leading-7 text-white resize-none custom-scroll whitespace-nowrap focus:outline-none bg-mainColor"
          />
        </div>
      </div>
      <div className="flex flex-col h-[30%]">
        <div className="p-2 text-white border-white border-y">OUTPUT</div>
        <textarea disabled className="flex-grow h-10 p-2 text-white border-b border-white resize-none bg-mainColor" />
        <div className="flex justify-end gap-2 px-2 py-1 h-fit">
          <button type="button" className="flex items-center justify-center px-4 py-2 text-xs bg-[#132A37] font-thin text-white rounded">
            저장하기
          </button>
          <button type="button" className="flex items-center justify-center px-4 py-2 text-xs bg-[#132A37] font-thin text-white rounded">
            초기화
          </button>
          <button type="button" className="flex items-center justify-center px-4 py-2 text-xs bg-[#132A37] font-thin text-white rounded">
            코드 실행
          </button>
        </div>
      </div>
    </div>
  );
}
