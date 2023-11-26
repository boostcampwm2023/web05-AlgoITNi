import useModalState, { MODAL_COMPONENTS } from '@/stores/useModalState';
import Modal from './Modal';

export default function Modals() {
  const { modals } = useModalState((state) => state);
  const { hideModal } = useModalState((state) => state);
  return (
    <>
      {modals.map((id) => (
        <Modal hide={() => hideModal(id)} key={id} Component={MODAL_COMPONENTS[id].Component} modalProps={MODAL_COMPONENTS[id].props} />
      ))}
    </>
  );
}
