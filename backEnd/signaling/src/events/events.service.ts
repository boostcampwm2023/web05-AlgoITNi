import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import * as cron from 'node-cron';
import { WebRtcGateway } from 'src/webRTC/web-rtc.gateway';

@Injectable()
export class EventsService implements OnModuleInit {
  constructor(
    @InjectRedis() private readonly client: Redis,
    private readonly configService: ConfigService,
    private readonly webRtcGateway: WebRtcGateway,
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
    this.scheduling();
  }

  private scheduling() {
    cron.schedule('*/5 * * * *', () => {
      const connectionCount = this.webRtcGateway.getConnectionCnt();
      const message = {
        url: this.configService.get<string>('SOCKET_URL'),
        connections: connectionCount,
      };
      this.client.publish('signaling', JSON.stringify(message));
    });
  }
}
