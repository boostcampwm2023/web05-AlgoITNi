import { useState } from 'react';

export default function useInput(initialValue: string) {
  const [inputValue, setInputValue] = useState(initialValue);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setInputValue(value);
  };

  return { inputValue, onChange };
}
