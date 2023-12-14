import { create } from 'zustand';
import { DataChannel } from '@/types/RTCConnection';

interface DataChannels {
  codeDataChannel: DataChannel[];
  addCodeDataChannel: (socketId: string, dataChannel: RTCDataChannel) => void;
  removeCodeDataChannel: (value: { id: string }) => void;

  languageDataChannel: DataChannel[];
  addLanguageChannel: (socketId: string, dataChannel: RTCDataChannel) => void;
  removeLanguageChannel: (value: { id: string }) => void;
}

const useDataChannels = create<DataChannels>((set) => ({
  codeDataChannel: [],
  addCodeDataChannel: (id, dataChannel) => set((state) => ({ ...state, codeDataChannel: [...state.codeDataChannel, { id, dataChannel }] })),
  removeCodeDataChannel: (data) =>
    set((state) => ({ ...state, codeDataChannel: [...state.codeDataChannel.filter(({ id }) => id !== data.id)] })),

  languageDataChannel: [],
  addLanguageChannel: (id, dataChannel) =>
    set((state) => ({ ...state, languageDataChannel: [...state.languageDataChannel, { id, dataChannel }] })),
  removeLanguageChannel: (data) =>
    set((state) => ({ ...state, languageDataChannel: [...state.languageDataChannel.filter(({ id }) => id !== data.id)] })),
}));

export default useDataChannels;
