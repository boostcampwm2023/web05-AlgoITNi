import { fireEvent, render, screen } from '@testing-library/react';
import VideoControlButton from '../VideoControlButton';

const videoTrack = [{ enabled: true }];

const mockGetVideoTrack = jest.fn().mockImplementation(() => videoTrack);

const mockStream = {
  getVideoTracks: mockGetVideoTrack,
} as unknown as MediaStream;

describe('MediaControllButton테스트', () => {
  it('video 대한 MediaControllButton을 누르면 video 설정이 반전된다.', async () => {
    render(<VideoControlButton onColor="white" offColor="white" stream={mockStream} className="" />);
    fireEvent.click(await screen.findByRole('button'));
    expect(mockGetVideoTrack).toHaveBeenCalled();
    expect(videoTrack).toStrictEqual([{ enabled: false }]);
  });
});
