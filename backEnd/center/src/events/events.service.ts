import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class EventsService implements OnModuleInit {
  constructor(@InjectRedis() private readonly client: Redis) {}

  onModuleInit() {
    this.subscribeSocketInfo();
  }

  private subscribeSocketInfo() {
    this.client.subscribe('register');
    this.client.on('message', (channel, message) => {
      if (channel === 'register') {
      }
    });
  }
}
