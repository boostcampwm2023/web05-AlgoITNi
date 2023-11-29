import axios from 'axios';
import { VITE_SOCKET_URL } from '@/constants/env';

export default async function getSocketURL(roomName: string) {
  const result = await axios.post(VITE_SOCKET_URL, { roomName });

  return result.data.result.url;
}
