/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, createContext, useCallback } from 'react';
import cancelImg from '@/assets/cancel.svg';
import useLayoutFocus from '@/hooks/useLayoutFocus';

const ANIMATION_RENDER = 'relative p-4 bg-white rounded-2xl animate-render';
const ANIMATION_REMOVE = 'relative p-4 bg-white rounded-2xl animate-remove';

export const ModalHideContext = createContext(() => {});

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
  const focusRef = useLayoutFocus<HTMLDivElement>();

  const handleCancel = useCallback(() => setClassName(ANIMATION_REMOVE), []);
  const handleAnimationEnd = () => className === ANIMATION_REMOVE && hide();
  const handleKeyDown = (e: React.KeyboardEvent) => e.key === 'Escape' && handleCancel();

  return (
    <div
      className="z-20 absolute top-0 left-0 flex items-center justify-center w-screen h-screen bg-[rgba(0,0,0,0.5)]"
      onClick={handleCancel}
    >
      <div
        tabIndex={-1}
        ref={focusRef}
        className={className}
        onClick={(e) => e.stopPropagation()}
        onAnimationEnd={handleAnimationEnd}
        onKeyDown={handleKeyDown}
      >
        <button className="absolute w-4 h-4 top-4 right-4" onClick={handleCancel} type="button">
          <img src={cancelImg} alt="cancel" />
        </button>
        <div className="py-8 reative">
          <ModalHideContext.Provider value={handleCancel}>
            <Component {...modalProps} />
          </ModalHideContext.Provider>
        </div>
      </div>
    </div>
  );
}
