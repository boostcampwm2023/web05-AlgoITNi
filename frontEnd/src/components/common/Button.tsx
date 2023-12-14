import { ReactNode } from 'react';

type ButtonProps = {
  children: ReactNode;
  onClick: () => void;
  fontSize: string;
  className?: string;
};

function Button({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

function Default({ children, onClick, fontSize, className }: ButtonProps) {
  return (
    <button
      type="button"
      className={`px-[1.6vw] py-[14px] rounded-lg font-Pretendard  drop-shadow-lg bg-point-blue text-white ${className}`}
      onClick={onClick}
      style={{ fontSize }}
    >
      {children}
    </button>
  );
}

function Full({ children, onClick, fontSize, className }: ButtonProps) {
  return (
    <button
      type="button"
      className={`flex items-center justify-center w-full py-4 text-white border rounded-lg drop-shadow-lg bg-point-blue ${className}`}
      onClick={onClick}
      style={{ fontSize }}
    >
      {children}
    </button>
  );
}

function White({ children, onClick, fontSize, className }: ButtonProps) {
  return (
    <button
      type="button"
      className={`text-gray rounded-lg px-[1.6vw] py-[14px] bg-white drop-shadow-lg shadow ${className}`}
      onClick={onClick}
      style={{ fontSize }}
    >
      {children}
    </button>
  );
}

function Dark({ children, onClick, fontSize, className }: ButtonProps) {
  return (
    <button
      type="button"
      className={`text-gray rounded-lg px-[1.6vw] py-[14px] border drop-shadow-lg shadow ${className}`}
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
