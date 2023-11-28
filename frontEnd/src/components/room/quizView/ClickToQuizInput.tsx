import clickSrc from '@/assets/click.svg';

export default function ClickToQuizInput() {
  return (
    <div className="flex gap-2">
      <img src={clickSrc} width="20px" alt="clickIcon" />
      <div>클릭해서 링크 입력하기</div>
    </div>
  );
}
