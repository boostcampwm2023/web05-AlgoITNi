import { create } from 'zustand';

interface Speaker {
  speaker: string;
  setSpeaker: (value: string) => void;
}

const useSpeaker = create<Speaker>((set) => ({
  speaker: '',
  setSpeaker: (value) => set((state) => ({ ...state, speaker: value })),
}));

export default useSpeaker;
