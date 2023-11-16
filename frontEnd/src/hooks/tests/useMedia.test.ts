import { renderHook, waitFor } from '@testing-library/react';
import useMedia from '../useMedia';

const mockGetUserMedia = jest.fn(async () => {
  const stream = { value: 'testValue' } as unknown as MediaStream;
  return new Promise<MediaStream>((resolve) => {
    resolve(stream);
  });
});

const mockEnumerateDevices = jest.fn(async () => {
  const devices = [
    { kind: 'videoinput', value: 'testVideo' },
    { kind: 'audioinput', value: 'testMic' },
    { kind: 'audiooutput', value: 'testSpeaker' },
  ] as unknown as MediaDeviceInfo[];

  return new Promise<MediaDeviceInfo[]>((resolve) => {
    resolve(devices);
  });
});

const mockChangeGetUserMedia = jest.fn(async () => {
  const stream = { value: 'changeValue' } as unknown as MediaStream;
  return new Promise<MediaStream>((resolve) => {
    resolve(stream);
  });
});

const mockChangeEnumerateDevices = jest.fn(async () => {
  const devices = [
    { kind: 'videoinput', value: 'changeVideo' },
    { kind: 'audioinput', value: 'changeMic' },
    { kind: 'audiooutput', value: 'changeSpeaker' },
  ] as unknown as MediaDeviceInfo[];

  return new Promise<MediaDeviceInfo[]>((resolve) => {
    resolve(devices);
  });
});

Object.defineProperty(global.navigator, 'mediaDevices', {
  value: {
    getUserMedia: mockGetUserMedia,
    enumerateDevices: mockEnumerateDevices,
  },
  writable: true,
});

describe('useMedia 기능 테스트', () => {
  it('navigator.mediaDevices를 기반으로 가져온 stream으로 userStream을 업데이트할 수 있다.', () => {
    const { result } = renderHook(() => useMedia());
    waitFor(() => expect(result.current.stream).toStrictEqual({ value: 'testValue' }));
  });

  it('enumerateDevice를 통해 cameraList, micList, speakerList를 업데이트한다.', () => {
    const { result } = renderHook(() => useMedia());
    waitFor(() => {
      expect(result.current.camera.list).toStrictEqual([{ kind: 'videoinput', value: 'testVideo' }]);
      expect(result.current.mic.list).toStrictEqual([{ kind: 'audioinput', value: 'testMic' }]);
      expect(result.current.speaker.list).toStrictEqual([{ kind: 'audiooutput', value: 'testSpeaker' }]);
    });
  });

  it('selectedCamera, selectedMic, speaker가 바뀌면 useEffect가 재실행되어 enumerateDevice를 업데이트한다.', () => {
    const { result, rerender } = renderHook(() => useMedia());
    Object.defineProperty(global.navigator, 'mediaDevices', {
      value: {
        getUserMedia: mockChangeGetUserMedia,
        enumerateDevices: mockChangeEnumerateDevices,
      },
    });

    rerender({
      selectedCamera: 'change',
    });

    waitFor(() => {
      expect(result.current.stream).toStrictEqual({ value: 'changeValue' });
      expect(result.current.camera.list).toStrictEqual([{ kind: 'videoinput', value: 'changeVideo' }]);
      expect(result.current.mic.list).toStrictEqual([{ kind: 'audioinput', value: 'changeMic' }]);
      expect(result.current.speaker.list).toStrictEqual([{ kind: 'audiooutput', value: 'changeSpeaker' }]);
    });
  });
});
