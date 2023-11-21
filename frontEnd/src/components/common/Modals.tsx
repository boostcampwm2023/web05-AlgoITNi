import useModalState, { MODAL_COMPONENTS } from '@/stores/useModalState';
import ModalWrapper from './ModalWrapper';

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
      {modalComponents.map(({ Modal, id }) => (
        <ModalWrapper cancel={() => hideModal(id)} key={id}>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Modal.Component {...Modal.props} />
        </ModalWrapper>
      ))}
    </>
  );
}
