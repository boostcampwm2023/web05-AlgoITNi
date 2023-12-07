import { create } from 'zustand';

interface RoomConfigData {
  isConnectionDone: boolean;
  isSettingDone: boolean;
  isConnectionError: boolean;
  isSignalingError: boolean;
  nickname: string;
  actions: {
    finishConnection: () => void;
    stopConnection: () => void;
    settingOn: () => void;
    settingOff: () => void;
    setNickname: (value: string) => void;
    throwSignalError: () => void;
    throwConnectionError: () => void;
  };
}

const defaultCode = localStorage.getItem('code');
const defaultNickName = localStorage.getItem('nickName');

const useRoomConfigData = create<RoomConfigData>((set) => ({
  isConnectionDone: false,
  isSettingDone: (!!defaultCode || defaultCode === '') && !!defaultNickName,
  isSignalingError: false,
  isConnectionError: false,
  nickname: defaultNickName || '',
  actions: {
    finishConnection: () => set((state) => ({ ...state, isConnectionDone: true })),
    stopConnection: () => set((state) => ({ ...state, isConnectionDone: false })),
    settingOn: () => set((state) => ({ ...state, isSettingDone: true })),
    settingOff: () => set((state) => ({ ...state, isSettingDone: false })),
    setNickname: (value) => set((state) => ({ ...state, nickname: value })),
    throwSignalError: () => set((state) => ({ ...state, isSignalingError: true })),
    throwConnectionError: () => set((state) => ({ ...state, isConnectionError: true })),
  },
}));

export default useRoomConfigData;
