import { fireEvent, render, screen } from '@testing-library/react';
import Modal from '../ModalWrapper';

let cancel: jest.Mock;

beforeEach(() => {
  cancel = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('ModalWrapper 컴포넌트 테스트', () => {
  it('ModalWrapper의 overlay를 클릭하면 cancel함수가 호출된다', () => {
    const { container } = render(<Modal cancel={cancel}>Modal</Modal>);
    fireEvent.click(container.querySelector('div') as HTMLDivElement);
    expect(cancel).toHaveBeenCalled();
  });

  it('ModalWrapper의 취소 아이콘을 클릭하면 cancel 함수가 호출된다.', () => {
    render(<Modal cancel={cancel}>Modal</Modal>);
    fireEvent.click(screen.getByAltText('cancel'));
    expect(cancel).toHaveBeenCalled();
  });
});
