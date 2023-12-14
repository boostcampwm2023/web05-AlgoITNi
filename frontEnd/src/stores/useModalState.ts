import { create } from 'zustand';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MODAL_COMPONENTS: { [id: string]: { Component: React.ComponentType<any>; props?: Record<string, unknown> } } = {};

type ModalState = {
  modals: string[];
  actions: {
    showModal: (id: string) => void;
    hideModal: (id: string) => void;
  };
};

const useModalState = create<ModalState>((set) => ({
  modals: [],
  actions: {
    showModal: (id: string) =>
      set((state) => ({
        ...state,
        modals: [...state.modals, id],
      })),

    hideModal: (id: string) =>
      set((state) => ({
        ...state,
        modals: [...state.modals.filter((modalId) => modalId !== id)],
      })),
  },
}));

export default useModalState;
