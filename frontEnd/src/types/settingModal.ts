export type SettingType = 'audio' | 'video';
export type SettingProps = {
  list: MediaDeviceInfo[] | undefined;
  setFunc: (value: string) => void;
};
