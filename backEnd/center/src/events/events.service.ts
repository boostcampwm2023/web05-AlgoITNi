import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class EventsService implements OnModuleInit {
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
        await this.handleRegister(url);
      }

      if (channel === 'signaling') {
        const { url, connections } = data;
        await this.handleSignaling(url, connections);
      }
    });
  }

  private async handleRegister(url: string) {
    await this.client.set(url, 0);
  }

  private async handleSignaling(url: string, connections: number) {
    const currentUrl = await this.client.get('signaling');

    if (currentUrl) {
      const currentConnections = parseInt(
        await this.client.get(currentUrl),
        10,
      );

      if (connections < currentConnections) {
        await this.client.set('signaling', url);
        await this.client.set(url, connections);
      }
      return;
    }

    await this.client.set('signaling', url);
    await this.client.set(url, connections);
  }
}
