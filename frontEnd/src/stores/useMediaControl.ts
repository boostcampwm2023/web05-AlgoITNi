import { create } from 'zustand';

interface Media {
  micOn: boolean;
  videoOn: boolean;
  micToggle: () => void;
  videoToggle: () => void;
}

const useMediaControl = create<Media>((set) => ({
  micOn: true,
  videoOn: true,
  micToggle: () => set((state) => ({ ...state, micOn: !state.micOn })),
  videoToggle: () => set((state) => ({ ...state, videoOn: !state.videoOn })),
}));

export default useMediaControl;
