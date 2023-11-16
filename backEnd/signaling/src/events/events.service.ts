import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class EventsService implements OnModuleInit {
  constructor(
    @InjectRedis() private readonly client: Redis,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    this.publishSocketInfo();
  }

  private publishSocketInfo() {
    const socketUrl = this.configService.get<string>('SOCKET_URL');

    const message = {
      url: socketUrl,
    };
    this.client.publish('register', JSON.stringify(message));
  }
}
