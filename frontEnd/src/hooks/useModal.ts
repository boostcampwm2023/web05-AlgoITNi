import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import useModalState, { MODAL_COMPONENTS } from '@/stores/useModalState';

type CalledByModalInner = { hide: () => void };
type CalledByModalOuter<P> = { show: (props?: P) => void; hide: () => void };

function useModal(): CalledByModalInner;
function useModal<P extends Record<string, unknown>>(Component?: React.ComponentType<P>): CalledByModalOuter<P>;

function useModal<P extends Record<string, unknown>>(Component?: React.ComponentType<P>): CalledByModalInner | CalledByModalOuter<P> {
  const { showModal, hideModal, modals } = useModalState((state) => state);
  const [modalId] = useState(uuidv4());

  useEffect(() => {
    if (!Component) return;
    MODAL_COMPONENTS[modalId] = {
      Component,
    };
  }, [modalId]);

  const show = (props?: P) => {
    if (!Component) return;
    MODAL_COMPONENTS[modalId].props = props;
    showModal(modalId);
  };

  const hide = () => {
    if (Component) hideModal(modalId);
    else hideModal(modals[modals.length - 1]);
  };

  if (Component) return { show, hide };
  return { hide };
}

export default useModal;
