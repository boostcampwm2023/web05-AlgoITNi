import Button from '@/components/Button';

export default function Home() {
  const handleClick = () => {};

  return (
    <div className="h-[100vh] w-[100vw] bg-backgroundColor flex justify-center items-center py-[10vw] ">
      <div className="flex flex-col basis-[50%] gap-[130px] justify-center items-center">
        <div>
          <div className="text-[8.8vw] font-bold font-Pretendard ">AlgoITNi</div>
          <div className="text-[1.4vw]  font-Pretendard">AlgoITNi를 통해 동료, 친구와 함께 알고리즘을 학습해봐요!</div>
        </div>
        <div className="flex gap-[14px]">
          <Button onClick={handleClick} fontSize="1.8vw">
            방생성
          </Button>
          <input className="rounded-[15px] font-Pretendard px-[1.6vw] py-[14px] text-[1.8vw]" />
        </div>
      </div>
      <div className="basis-[50%] max-w-[500px] max-h-[500px] ">
        <img src="/main.png" alt="main" />
      </div>
    </div>
  );
}
