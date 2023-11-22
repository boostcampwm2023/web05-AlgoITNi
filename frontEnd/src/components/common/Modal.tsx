/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import cancelImg from '@/assets/cancel.svg';

const ANIMATION_RENDER = 'relative p-4 bg-white rounded-2xl animate-render';
const ANIMATION_REMOVE = 'relative p-4 bg-white rounded-2xl animate-remove';

export default function Modal({
  Component,
  modalProps,
  hide,
}: {
  Component: React.ComponentType<any>;
  modalProps?: Record<string, unknown>;
  hide: () => void;
}) {
  const [className, setClassName] = useState(ANIMATION_RENDER);
  const handleCancel = () => setClassName(ANIMATION_REMOVE);
  const handleAnimationEnd = () => className === ANIMATION_REMOVE && hide();

  return (
    <div
      className="z-20 absolute top-0 left-0 flex items-center justify-center w-screen h-screen bg-[rgba(0,0,0,0.5)]"
      onClick={handleCancel}
    >
      <div className={className} onClick={(e) => e.stopPropagation()} onAnimationEnd={handleAnimationEnd}>
        <button className="absolute w-4 h-4 top-4 right-4" onClick={handleCancel} type="button">
          <img src={cancelImg} alt="cancel" />
        </button>
        <div className="py-8 reative">
          <Component {...{ ...modalProps, hide: handleCancel }} />
        </div>
      </div>
    </div>
  );
}
