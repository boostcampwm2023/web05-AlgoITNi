import React, { useEffect, useState, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import useModalState, { MODAL_COMPONENTS } from '@/stores/useModalState';
import { ModalHideContext } from '@/components/common/Modal';

type CalledByModalInner = { hide: () => void };
type CalledByModalOuter<P> = { show: (props?: P) => void; hide: () => void };

function useModal(): CalledByModalInner;
function useModal<P extends Record<string, unknown>>(Component?: React.ComponentType<P>): CalledByModalOuter<P>;

function useModal<P extends Record<string, unknown>>(Component?: React.ComponentType<P>): CalledByModalInner | CalledByModalOuter<P> {
  const { showModal, hideModal } = useModalState((state) => state);
  const [modalId] = useState(uuidv4());
  // Modals에서 주입시킨 Provider로부터 Modal에 애니메이션을 적용시키는 함수 Context를 가져온다.
  const hideThisModal = useContext(ModalHideContext);

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
    else hideThisModal();
  };

  if (Component) return { show, hide };
  return { hide };
}

export default useModal;
