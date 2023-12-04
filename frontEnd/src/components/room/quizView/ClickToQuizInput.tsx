import clickSrc from '@/assets/click.svg';

export default function ClickToQuizInput({ handleClick }: { handleClick: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-1 px-2 pt-2">
      <button type="button" className="flex flex-col items-center justify-center h-full" onClick={handleClick}>
        <img src="/main.png" alt="logo" width="150px" />
        <div className="flex items-center justify-center ">
          <img src={clickSrc} width="20px" alt="clickIcon" />
          <div>클릭해서 링크 입력하기</div>
        </div>
      </button>
    </div>
  );
}
