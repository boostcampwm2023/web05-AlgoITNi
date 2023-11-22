import useModalState, { MODAL_COMPONENTS } from '@/stores/useModalState';
import Modal from './Modal';

export default function Modals() {
  const { modals } = useModalState((state) => state);
  const { hideModal } = useModalState((state) => state);
  const modalComponents = modals
    .filter((modal) => modal.visible)
    .filter((modal) => MODAL_COMPONENTS[modal.id])
    .map((modal) => ({
      id: modal.id,
      Modal: MODAL_COMPONENTS[modal.id],
    }));

  return (
    <>
      {modalComponents.map(({ Modal: modal, id }) => (
        <Modal hide={() => hideModal(id)} key={id} Component={modal.Component} modalProps={modal.props} />
      ))}
    </>
  );
}
