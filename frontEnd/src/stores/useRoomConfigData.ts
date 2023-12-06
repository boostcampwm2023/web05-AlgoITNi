import { create } from 'zustand';

interface RoomConfigData {
  isSettingDone: boolean;
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
  isSettingDone: (!!defaultCode || defaultCode === '') && !!defaultNickName,
  nickname: defaultNickName || '',
  actions: {
    settingOn: () => set((state) => ({ ...state, isSettingDone: true })),
    settingOff: () => set((state) => ({ ...state, isSettingDone: false })),
    setNickname: (value) => set((state) => ({ ...state, nickname: value })),
  },
}));

export default useRoomConfigData;
