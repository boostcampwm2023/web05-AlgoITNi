import { fireEvent, render, screen } from '@testing-library/react';
import MediaControlButton from '../MediaControlButton';

const videoTrack = [{ enabled: true }];
const audioTrack = [{ enabled: true }];

const mockGetVideoTrack = jest.fn().mockImplementation(() => videoTrack);
const mockGetAudioTrack = jest.fn().mockImplementation(() => audioTrack);

const mockStream = {
  getVideoTracks: mockGetVideoTrack,
  getAudioTracks: mockGetAudioTrack,
} as unknown as MediaStream;

describe('MediaControllButton테스트', () => {
  it('audio에 대한 MediaControllButton을 누르면 audio 설정이 반전된다.', async () => {
    render(<MediaControlButton color="white" stream={mockStream} kind="mic" className="" />);
    fireEvent.click(await screen.findByRole('button'));
    expect(mockGetAudioTrack).toHaveBeenCalled();
    expect(audioTrack).toStrictEqual([{ enabled: false }]);
  });

  it('video 대한 MediaControllButton을 누르면 audio 설정이 반전된다.', async () => {
    render(<MediaControlButton color="white" stream={mockStream} kind="video" className="" />);
    fireEvent.click(await screen.findByRole('button'));
    expect(mockGetVideoTrack).toHaveBeenCalled();
    expect(videoTrack).toStrictEqual([{ enabled: false }]);
  });
});
