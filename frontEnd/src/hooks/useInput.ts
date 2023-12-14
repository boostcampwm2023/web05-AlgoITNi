import { useState } from 'react';

export default function useInput<T extends HTMLInputElement | HTMLTextAreaElement>(initialValue: string) {
  const [inputValue, setInputValue] = useState(initialValue);

  const onChange = (event: React.ChangeEvent<T>) => {
    const {
      target: { value },
    } = event;
    setInputValue(value);
  };

  const resetInput = () => {
    setInputValue('');
  };

  return { inputValue, onChange, resetInput };
}
