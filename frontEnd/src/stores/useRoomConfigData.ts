import { create } from 'zustand';

interface RoomConfigData {
  isConnectionDone: boolean;
  isSettingDone: boolean;
  isConnectionError: boolean;
  isSignalingError: boolean;
  mediaPermisson: boolean;
  nickname: string;
  actions: {
    finishConnection: () => void;
    stopConnection: () => void;
    settingOn: () => void;
    settingOff: () => void;
    setNickname: (value: string) => void;
    throwSignalError: () => void;
    throwConnectionError: () => void;
    grantMediaPermission: () => void;
    revokeMediaPermission: () => void;
    resolveSignalError: () => void;
    resolveConnectionError: () => void;
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
  mediaPermisson: true,
  actions: {
    finishConnection: () => set((state) => ({ ...state, isConnectionDone: true })),
    stopConnection: () => set((state) => ({ ...state, isConnectionDone: false })),
    settingOn: () => set((state) => ({ ...state, isSettingDone: true })),
    settingOff: () => set((state) => ({ ...state, isSettingDone: false })),
    setNickname: (value) => set((state) => ({ ...state, nickname: value })),
    grantMediaPermission: () => set((state) => ({ ...state, mediaPermisson: true })),
    revokeMediaPermission: () => set((state) => ({ ...state, mediaPermisson: false })),
    throwSignalError: () => set((state) => ({ ...state, isSignalingError: true })),
    throwConnectionError: () => set((state) => ({ ...state, isConnectionError: true })),
    resolveSignalError: () => set((state) => ({ ...state, isSignalingError: false })),
    resolveConnectionError: () => set((state) => ({ ...state, isConnectionError: false })),
  },
}));

export default useRoomConfigData;
