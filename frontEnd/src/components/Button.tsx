import { ReactNode } from 'react';

export default function Button({ children, onClick, fontSize }: { children: ReactNode; onClick: () => void; fontSize: string }) {
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
