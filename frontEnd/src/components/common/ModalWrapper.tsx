/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { ReactNode } from 'react';
import cancelImg from '@/assets/cancel.svg';

export default function ModalWrapper({ children, cancel }: { children: ReactNode; cancel: () => void }) {
  return (
    <div className="z-20 absolute top-0 left-0 flex items-center justify-center w-screen h-screen bg-[rgba(0,0,0,0.5)]" onClick={cancel}>
      <div className="relative p-4 bg-white rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="absolute w-4 h-4 top-4 right-4" onClick={cancel}>
          <img src={cancelImg} alt="cancel" />
        </div>
        <div className="py-8">{children}</div>
      </div>
    </div>
  );
}
