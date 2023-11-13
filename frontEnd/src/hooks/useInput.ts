import { useState } from 'react';

export default function useInput(initialValue: string) {
  const [value, setValue] = useState(initialValue);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target) setValue(event.target.value);
  };

  return { inputValue: value, onChange };
}
