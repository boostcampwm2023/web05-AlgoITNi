import { useRef, useState } from 'react';

let timer: NodeJS.Timeout | null;

export default function useScroll<T extends HTMLElement>() {
  const [scrollRatio, setScrollRatio] = useState(100);
  const ref = useRef<T | null>(null);

  const handleScroll = () => {
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;

        if (!ref.current) return;

        const { scrollTop, clientHeight, scrollHeight } = ref.current;
        setScrollRatio(((scrollTop + clientHeight) / scrollHeight) * 100);
      }, 200);
    }
  };

  const moveToBottom = () => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
    setScrollRatio(100);
  };

  return { ref, scrollRatio, handleScroll, moveToBottom };
}
