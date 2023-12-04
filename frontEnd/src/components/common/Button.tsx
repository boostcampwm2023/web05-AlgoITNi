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
      className="px-[1.6vw] py-[14px] bg-primary rounded-[15px] font-Pretendard border drop-shadow-lg"
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
      className="px-[1.6vw] py-[14px] bg-primary rounded-[15px] w-full border drop-shadow-lg"
      onClick={onClick}
      style={{ fontSize }}
    >
      {children}
    </button>
  );
}

function White({ children, onClick, fontSize }: ButtonProps) {
  return (
    <button
      type="button"
      className="border-2 border-light-gray text-gray rounded-[15px] px-[1.6vw] py-[14px] bg-white drop-shadow-lg shadow"
      onClick={onClick}
      style={{ fontSize }}
    >
      {children}
    </button>
  );
}

function Dark({ children, onClick, fontSize }: ButtonProps) {
  return (
    <button
      type="button"
      className="text-gray rounded-[15px] px-[1.6vw] py-[14px] border drop-shadow-lg shadow"
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
  White,
  Dark,
});
