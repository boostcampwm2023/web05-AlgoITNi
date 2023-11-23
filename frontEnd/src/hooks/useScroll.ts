import { useEffect, useState } from 'react';

export default function useScroll() {
  const [scrollRatio, setScrollRatio] = useState(100);
  const [isLastMessageView, setIsLastMessageView] = useState(true);
  const [isRecievedMessage, setIsRecievedMessage] = useState(false);

  useEffect(() => {
    if (scrollRatio >= 95) {
      setIsLastMessageView(true);
      setIsRecievedMessage(false);
    } else setIsLastMessageView(false);
  }, [scrollRatio]);

  return { setIsRecievedMessage, setScrollRatio, isRecievedMessage, isLastMessageView };
}
