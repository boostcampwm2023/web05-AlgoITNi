import { ReactNode } from 'react';

type ButtonProps = {
  children: ReactNode;
  onClick: () => void;
  fontSize: string;
};
function Button({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

function Default({ children, onClick, fontSize }: ButtonProps) {
  return (
    <button
      type="button"
      className="px-[1.6vw] py-[14px] bg-mainColor text-white rounded-[15px] font-Pretendard"
      onClick={onClick}
      style={{ fontSize }}
    >
      {children}
    </button>
  );
}

function Full({ children, onClick, fontSize }: ButtonProps) {
  return (
    <button
      type="button"
      className="px-[1.6vw] py-[14px] bg-mainColor text-white rounded-[15px] font-Pretendard w-full"
      onClick={onClick}
      style={{ fontSize }}
    >
      {children}
    </button>
  );
}

export default Object.assign(Button, {
  Default,
  Full,
});
