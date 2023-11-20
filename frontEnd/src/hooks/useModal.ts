import { ReactNode, useState } from 'react';
import Modal from '@/components/common/Modal';

export default function useModal() {
  const [open, setOpen] = useState(false);

  const closeModal = () => {
    setOpen(false);
  };

  const openModal = () => {
    setOpen(true);
  };

  const modalComponent = open ? ({ children }: { children: ReactNode }) => Modal({ children, cancel: closeModal }) : () => null;

  return {
    Modal: modalComponent,
    openModal,
    closeModal,
  };
}
