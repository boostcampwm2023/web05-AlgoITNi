interface ToggleAiProps {
  usingAi: boolean;
  setUsingAi: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ToggleAi({ usingAi, setUsingAi }: ToggleAiProps) {
  const handleChangeMessageType = () => {
    setUsingAi((prev) => !prev);
  };

  return (
    <div className="flex gap-3 font-light">
      <button
        onClick={handleChangeMessageType}
        type="button"
        className={`relative flex w-12 h-6 gap-3 mb-2 ml-1 rounded-full ${usingAi ? 'bg-point-blue' : 'bg-gray-300'}`}
      >
        <div
          className={`absolute w-5 h-5 ml-4 transition-[margin-left_1s_ease_in] bg-white rounded-full top-0.5 ${
            usingAi ? 'left-2.5' : '-left-3.5'
          }`}
        />
      </button>
      <span>AI 기능을 이용해보세요!</span>
    </div>
  );
}
