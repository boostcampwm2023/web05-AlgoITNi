import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Server, Socket } from 'socket.io';

export function createRedisTestingModule() {
  return RedisModule.forRoot({
    config: {
      host: 'localhost',
      port: 6379,
    },
  });
}

export class MockSocket implements Partial<Socket> {
  id: string;
  server: Server;

  constructor(id: string) {
    this.id = id;
  }

  join = jest.fn();
  emit = jest.fn();
}
