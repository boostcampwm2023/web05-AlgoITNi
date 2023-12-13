import axios from 'axios';
import { VITE_SOCKET_URL } from '@/constants/env';

type SocketType = 'signalling' | 'chatting';

export const SOCKET_TYPE: Record<string, SocketType> = {
  SIGNAL: 'signalling',
  CHAT: 'chatting',
};

export default async function getSocketURL(type: SocketType, roomName: string) {
  const result = await axios.post(`${VITE_SOCKET_URL}/${type}`, { roomName });

  return result.data.result.url;
}
