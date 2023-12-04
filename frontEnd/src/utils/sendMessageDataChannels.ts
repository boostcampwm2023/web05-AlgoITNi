import { DataChannel } from '@/types/RTCConnection';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function sendMessageDataChannels(dataChannels: DataChannel[], message: any) {
  dataChannels.forEach(({ dataChannel }) => {
    if (dataChannel.readyState === 'open') dataChannel.send(message);
  });
}
