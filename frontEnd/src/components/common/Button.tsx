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
      className="px-[1.6vw] py-[14px] rounded-lg font-Pretendard  drop-shadow-lg bg-point-blue text-white"
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
      className="px-[1.6vw] py-[14px]  rounded-lg w-full border drop-shadow-lg bg-point-blue text-white"
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
      className=" text-gray rounded-lg px-[1.6vw] py-[14px] bg-white drop-shadow-lg shadow"
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
      className="text-gray rounded-lg px-[1.6vw] py-[14px] border drop-shadow-lg shadow "
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
