import { useEffect } from 'react';
import { DataChannel } from '@/types/RTCConnection';

export default function useDataChannelOnMessage(dataChannelArr: DataChannel[], onMessageHandler: (event: MessageEvent) => void) {
  useEffect(() => {
    dataChannelArr.forEach(({ dataChannel }) => {
      dataChannel.onmessage = onMessageHandler;
    });
  }, [dataChannelArr]);
}
