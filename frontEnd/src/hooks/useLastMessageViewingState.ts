import { useEffect, useState } from 'react';

export default function useLastMessageViewingState() {
  const [scrollRatio, setScrollRatio] = useState(100);
  const [isViewingLastMessage, setIsViewingLastMessage] = useState(true);
  const [isRecievedMessage, setIsRecievedMessage] = useState(false);

  useEffect(() => {
    if (scrollRatio >= 95) {
      setIsViewingLastMessage(true);
      setIsRecievedMessage(false);
    } else setIsViewingLastMessage(false);
  }, [scrollRatio]);

  return { setScrollRatio, setIsRecievedMessage, isRecievedMessage, isViewingLastMessage };
}
