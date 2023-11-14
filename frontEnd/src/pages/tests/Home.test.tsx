import { fireEvent, render, screen } from '@testing-library/react';
import Home from '@pages/Home';

jest.mock('uuid', () => {
  return { v4: jest.fn(() => 'test') };
});

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Home 테스트', () => {
  it('방생성 클릭시, uuid를 url로 갖는 새로운 방을 생성하고, 해당 방 url로 이동한다.', async () => {
    render(<Home />);
    await fireEvent.click(screen.getByText('방생성'));
    expect(mockNavigate).toHaveBeenCalledWith('/test');
  });

  it('참가 클릭시, input입력창에 입력한 url을 가진 방으로 이동한다.', async () => {
    render(<Home />);
    const input = screen.getByPlaceholderText('');
    fireEvent.change(input, { target: { value: 'inputValue' } });
    await fireEvent.click(screen.getByText('참여'));
    expect(mockNavigate).toHaveBeenCalledWith('/inputValue');
  });
});
