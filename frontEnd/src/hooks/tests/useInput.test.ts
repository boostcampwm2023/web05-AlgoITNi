import { act, renderHook } from '@testing-library/react';
import useInput from '../useInput';

describe('useInput 기능테스트', () => {
  it('useInput의 초기값은 입력한 값으로 초기화 된다.', () => {
    const { result } = renderHook(() => useInput('initial'));
    expect(result.current.inputValue).toBe('initial');
  });

  it('onChange가 일어나면 event.target.value로 값을 변경한다.', () => {
    const { result } = renderHook(() => useInput('initial'));

    const mockEvent = { target: { value: 'changeValue' } } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.onChange(mockEvent);
    });

    expect(result.current.inputValue).toBe('changeValue');
  });
});
