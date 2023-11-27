import { QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import SaveModal from '../SaveModal';
import { ModalHideContext } from '@/components/modal/Modal';
import reactQueryClient from '@/configs/reactQueryClient';

const hide = jest.fn();
jest.mock('@/apis/postUserCode', () => {});

describe('SaveModal기능테스트', () => {
  it('값이 없을때는 저장 버튼을 눌러도 제출하지 않는다.', () => {
    render(
      <QueryClientProvider client={reactQueryClient}>
        <ModalHideContext.Provider value={hide}>
          <SaveModal code="123" />
        </ModalHideContext.Provider>
        ,
      </QueryClientProvider>,
    );
    fireEvent.click(screen.getByText('저장하기'));
    expect(hide).toHaveBeenCalledTimes(0);
  });

  it('값이 없을때는 엔터버튼을 눌러도 제출하지 않는다.', () => {
    render(
      <QueryClientProvider client={reactQueryClient}>
        <ModalHideContext.Provider value={hide}>
          <SaveModal code="123" />
        </ModalHideContext.Provider>
      </QueryClientProvider>,
    );
    fireEvent.keyDown(screen.getByPlaceholderText('solution.py'), { key: 'Enter' });
    expect(hide).toHaveBeenCalledTimes(0);
  });

  it('값이 있다면 저장 버튼을 눌렀을때 제출한다.', () => {
    render(
      <QueryClientProvider client={reactQueryClient}>
        <ModalHideContext.Provider value={hide}>
          <SaveModal code="123" />
        </ModalHideContext.Provider>
      </QueryClientProvider>,
    );
    fireEvent.change(screen.getByPlaceholderText('solution.py'), { target: { value: 'solution.py' } });
    fireEvent.click(screen.getByText('저장하기'));
    expect(hide).toHaveBeenCalled();
  });

  it('값이 있다면 엔터버튼을 눌렀을때 제출한다.', () => {
    render(
      <QueryClientProvider client={reactQueryClient}>
        <ModalHideContext.Provider value={hide}>
          <SaveModal code="123" />
        </ModalHideContext.Provider>
      </QueryClientProvider>,
    );
    fireEvent.change(screen.getByPlaceholderText('solution.py'), { target: { value: 'solution.py' } });
    fireEvent.keyDown(screen.getByPlaceholderText('solution.py'), { key: 'Enter' });
    expect(hide).toHaveBeenCalled();
  });
});
