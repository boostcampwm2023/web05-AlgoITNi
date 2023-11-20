import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import useModalState, { MODAL_COMPONENTS } from '@/stores/useModalState';

export default function useCreateModal<P extends Record<string, unknown>>(Component: React.ComponentType<P>) {
  const { addModal, showModal, hideModal } = useModalState((state) => state);
  const [modalId] = useState(uuidv4());

  useEffect(() => {
    MODAL_COMPONENTS[modalId] = {
      Comp: Component,
    };
    addModal(modalId);
  }, [modalId]);

  const show = (props?: P) => {
    MODAL_COMPONENTS[modalId].props = props;
    showModal(modalId);
  };

  const hide = () => {
    hideModal(modalId);
  };

  return { show, hide };
}
