import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { ReturnConnectionsDto } from 'src/connections/dto/return-connections.dto copy';
import { SignalingConnectionDto } from 'src/connections/dto/signaling-connections.dto';

@Injectable()
export class EventsService implements OnModuleInit {
  private serverToUrl: Map<string, string> = new Map();
  private serverToConnections: Map<string, number> = new Map();
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
        const { url, connections } = data;
        this.handleSignaling(url, connections);
      }
    });
  }

  private handleRegister(url: string) {
    this.serverToConnections.set(url, 0);

    const nextServer = this.serverToUrl.get('signaling');
    if (!nextServer) {
      this.serverToUrl.set('signaling', url);
    }
  }

  private handleSignaling(url: string, connections: number) {
    const nextServer = this.serverToUrl.get('signaling');
    const minConnections = this.serverToConnections.get(nextServer);

    if (connections < minConnections) {
      this.serverToUrl.set('signaling', url);
    }

    this.serverToConnections.set(url, connections);
  }

  findSignalingServer(data: SignalingConnectionDto): ReturnConnectionsDto {
    const { roomName } = data;

    const isServer = this.roomToUrl.get(roomName);

    if (isServer) {
      const result: ReturnConnectionsDto = { url: isServer };
      return result;
    }

    const server = this.serverToUrl.get('signaling');
    this.roomToUrl.set(roomName, server);
    const result: ReturnConnectionsDto = { url: server };
    return result;
  }

  leaveRoom(data: SignalingConnectionDto) {
    const { roomName } = data;
    this.roomToUrl.delete(roomName);
  }
}
