import { act } from 'react-dom/test-utils';
import { renderHook } from '@testing-library/react';
import useModal from '../useModal';

describe('useModal 기능 테스트', () => {
  it('openModal을 호출하면 모달이 열린다.', () => {
    const { result } = renderHook(() => useModal());

    expect(result.current.Modal({ children: '123' })).toBeNull();
    act(() => {
      result.current.openModal();
    });
    expect(result.current.Modal({ children: '123' })).toBeTruthy();
  });

  it('closeModal을 호출하면 모달이 닫힌다.', () => {
    const { result } = renderHook(() => useModal());
    act(() => {
      result.current.openModal();
    });
    expect(result.current.Modal({ children: '123' })).toBeTruthy();

    act(() => {
      result.current.closeModal();
    });
    expect(result.current.Modal({ children: '123' })).toBeNull();
  });
});
