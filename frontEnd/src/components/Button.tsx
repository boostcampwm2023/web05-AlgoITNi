import { ReactNode } from 'react';

type ButtonProps = {
  children: ReactNode;
  onClick: () => void;
  fontSize: string;
};

export default function Button({ children, onClick, fontSize }: ButtonProps) {
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
