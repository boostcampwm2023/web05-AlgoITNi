import { useLayoutEffect, useRef } from 'react';

export default function useLayoutFocus<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    if (ref.current) ref.current.focus();
  }, []);
  return ref;
}
