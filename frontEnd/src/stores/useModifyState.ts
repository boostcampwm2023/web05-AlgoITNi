import { create } from 'zustand';

type ModifyState = {
  modifyId: string;
  setModifyId: (value: string) => void;
};

const useModifyState = create<ModifyState>((set) => ({
  modifyId: '',
  setModifyId: (value: string) => set((state) => ({ ...state, modifyId: value })),
}));

export default useModifyState;
