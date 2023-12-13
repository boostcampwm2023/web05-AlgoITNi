import { io } from 'socket.io-client/debug';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SocketCallback = Record<string, any>;

export default function createSocket(socketURL: string, socketCallback: SocketCallback) {
  const socket = io(socketURL, { transports: ['websocket'] });
  Object.entries(socketCallback).forEach(([event, callback]) => {
    socket.on(event, callback);
  });

  return socket;
}
