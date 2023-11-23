import Button from '@/components/common/Button';

export default function SuccessModal({ hide }: { hide: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-xl">성공적으로 저장되었어요!</div>
      <img src="/main.png" alt="logo" width="150px" height="150px" />
      <Button.Default onClick={() => hide()} fontSize="1vw">
        닫기
      </Button.Default>
    </div>
  );
}
