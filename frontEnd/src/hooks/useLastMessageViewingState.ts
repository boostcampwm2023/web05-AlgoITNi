import { useEffect, useState } from 'react';

export default function useLastMessageViewingState(scrollRatio: number) {
  const [isViewingLastMessage, setIsViewingLastMessage] = useState(true);
  const [isRecievedMessage, setIsRecievedMessage] = useState(false);

  useEffect(() => {
    if (scrollRatio >= 95) {
      setIsViewingLastMessage(true);
      setIsRecievedMessage(false);
    } else setIsViewingLastMessage(false);
  }, [scrollRatio]);

  return { setIsRecievedMessage, isRecievedMessage, isViewingLastMessage };
}
