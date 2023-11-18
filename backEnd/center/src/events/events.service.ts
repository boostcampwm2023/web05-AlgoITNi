import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { ResponseUrlDto } from 'src/connections/dto/response-url.dto copy';
import { JoinRoomDto } from 'src/connections/dto/join-room.dto';

@Injectable()
export class EventsService implements OnModuleInit {
  private serverToUrl: Map<string, string> = new Map();
  private serverToCpus: Map<string, number> = new Map();
  private roomToUrl: Map<string, string> = new Map();

  constructor(@InjectRedis() private readonly client: Redis) {}

  onModuleInit() {
    this.subscribe();
  }

  private subscribe() {
    this.client.subscribe('register');
    this.client.subscribe('signaling');

    this.client.on('message', async (channel, message) => {
      const data = JSON.parse(message);

      if (channel === 'register') {
        const { url } = data;
        this.handleRegister(url);
      }

      if (channel === 'signaling') {
        const { url, usages } = data;
        this.handleSignaling(url, usages);
      }
    });
  }

  private handleRegister(url: string) {
    this.serverToCpus.set(url, 0);

    const nextServer = this.serverToUrl.get('signaling');
    if (!nextServer) {
      this.serverToUrl.set('signaling', url);
    }
  }

  private handleSignaling(url: string, usages: number) {
    const nextServer = this.serverToUrl.get('signaling');
    const minUsages = this.serverToCpus.get(nextServer);

    if (usages < minUsages) {
      this.serverToUrl.set('signaling', url);
    }

    this.serverToCpus.set(url, usages);
  }

  findSignalingServer(data: JoinRoomDto): ResponseUrlDto {
    const { roomName } = data;

    const isServer = this.roomToUrl.get(roomName);

    if (isServer) {
      const result: ResponseUrlDto = { url: isServer };
      return result;
    }

    const server = this.serverToUrl.get('signaling');
    this.roomToUrl.set(roomName, server);
    const result: ResponseUrlDto = { url: server };
    return result;
  }

  leaveRoom(data: JoinRoomDto) {
    const { roomName } = data;
    this.roomToUrl.delete(roomName);
  }
}
