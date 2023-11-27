import { createPortal } from 'react-dom';
import useModalState, { MODAL_COMPONENTS } from '@/stores/useModalState';
import Modal from './Modal';

const portalElement = document.getElementById('modal') as HTMLElement;

export default function Modals() {
  const { modals, hideModal } = useModalState((state) => state);
  return createPortal(
    <>
      {modals.map((id) => (
        <Modal hide={() => hideModal(id)} key={id} Component={MODAL_COMPONENTS[id].Component} modalProps={MODAL_COMPONENTS[id].props} />
      ))}
    </>,
    portalElement,
  );
}
