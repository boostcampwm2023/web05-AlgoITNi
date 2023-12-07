import { fireEvent, render, screen } from '@testing-library/react';
import MicControlButton from '../MicControlButton';

const audioTrack = [{ enabled: true }];

const mockGetAudioTrack = jest.fn().mockImplementation(() => audioTrack);

const mockStream = {
  getAudioTracks: mockGetAudioTrack,
} as unknown as MediaStream;

describe('MicControllButton테스트', () => {
  it('audio에 대한 MicControllButton을 누르면 audio 설정이 반전된다.', async () => {
    render(<MicControlButton onColor="white" offColor="white" stream={mockStream} className="" />);
    fireEvent.click(await screen.findByRole('button'));
    expect(mockGetAudioTrack).toHaveBeenCalled();
    expect(audioTrack).toStrictEqual([{ enabled: false }]);
  });
});
