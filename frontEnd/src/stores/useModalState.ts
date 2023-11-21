import { create } from 'zustand';

// 전체 등록된 모달을 관리한다.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MODAL_COMPONENTS: { [id: string]: { Component: React.ComponentType<any>; props?: Record<string, unknown> } } = {};

type Modal = {
  id: string;
  visible: boolean;
  props: Record<string, unknown>;
};
type ModalState = {
  modals: Modal[];
  addModal: (id: string) => void;
  removeModal: (id: string) => void;
  showModal: (id: string) => void;
  hideModal: (id: string) => void;
};

const useModalState = create<ModalState>((set) => ({
  modals: [],
  addModal: (id: string) => set((state) => ({ ...state, modals: [...state.modals, { id, visible: false, props: MODAL_COMPONENTS[id] }] })),
  removeModal: (id: string) => set((state) => ({ ...state, modals: [...state.modals.filter((modal) => modal.id !== id)] })),
  showModal: (id: string) => set((state) => ({ ...state, modals: [...state.modals, { id, visible: true, props: MODAL_COMPONENTS[id] }] })),
  hideModal: (id: string) =>
    set((state) => ({
      ...state,
      modals: [...state.modals.filter((modal) => modal.id !== id), { id, visible: false, props: MODAL_COMPONENTS[id] }],
    })),
}));

export default useModalState;
