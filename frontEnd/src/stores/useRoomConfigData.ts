import { create } from 'zustand';

interface RoomConfigData {
  isSetting: boolean;
  nickname: string;
  actions: {
    settingOn: () => void;
    settingOff: () => void;
    setNickname: (value: string) => void;
  };
}

const defaultCode = localStorage.getItem('code');
const defaultNickName = localStorage.getItem('nickName');

const useRoomConfigData = create<RoomConfigData>((set) => ({
  isSetting: (!!defaultCode || defaultCode === '') && !!defaultNickName,
  nickname: defaultNickName || '',
  actions: {
    settingOn: () => set((state) => ({ ...state, isSetting: true })),
    settingOff: () => set((state) => ({ ...state, isSetting: false })),
    setNickname: (value) => set((state) => ({ ...state, nickname: value })),
  },
}));

export default useRoomConfigData;
