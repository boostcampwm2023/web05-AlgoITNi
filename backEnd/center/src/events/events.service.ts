import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { ResponseUrlDto } from 'src/connections/dto/response-url.dto';
import { JoinRoomDto } from 'src/connections/dto/join-room.dto';
import {
  URLNotFoundException,
  ValidateDtoException,
} from 'src/common/exception/exception';
import { ERRORS, EVENT } from 'src/common/utils';

@Injectable()
export class EventsService implements OnModuleInit {
  private returnUrl: string;
  private serverToCpus: Map<string, number> = new Map();
  private roomToUrl: Map<string, string> = new Map();

  constructor(@InjectRedis() private readonly client: Redis) {}

  onModuleInit() {
    this.subscribe();
  }

  private subscribe() {
    this.client.subscribe(EVENT.REGISTER);
    this.client.subscribe(EVENT.SIGNALING);

    this.client.on('message', async (channel, message) => {
      const data = JSON.parse(message);

      if (channel === EVENT.REGISTER) {
        const { url } = data;
        this.validateUrl(url);
        this.handleRegister(url);
      }

      if (channel === EVENT.SIGNALING) {
        const { url, usages } = data;
        this.validateUrl(url);
        this.validateUsages(usages);
        this.handleSignaling(url, usages);
      }
    });
  }

  private handleRegister(url: string) {
    this.serverToCpus.set(url, 0);

    const nextServer = this.returnUrl;
    if (!nextServer) {
      this.returnUrl = url;
    }
  }

  private handleSignaling(url: string, usages: number) {
    const nextServer = this.returnUrl;
    const minUsages = this.serverToCpus.get(nextServer);

    if (usages < minUsages) {
      this.returnUrl = url;
    }

    this.serverToCpus.set(url, usages);
  }

  findServer(data: JoinRoomDto): ResponseUrlDto {
    const { roomName } = data;
    this.validateRoom(roomName);

    const isServer = this.roomToUrl.get(roomName);

    if (isServer) {
      const result: ResponseUrlDto = { url: isServer };
      return result;
    }

    const server = this.returnUrl;

    if (!server) {
      throw new URLNotFoundException(ERRORS.URL_NOT_FOUND.message);
    }

    this.roomToUrl.set(roomName, server);
    const result: ResponseUrlDto = { url: server };
    return result;
  }

  leaveRoom(data: JoinRoomDto) {
    const { roomName } = data;
    this.validateRoom(roomName);
    this.roomToUrl.delete(roomName);
  }

  validateRoom(room: string) {
    if (!room) {
      throw new ValidateDtoException(ERRORS.ROOM_EMPTY.message);
    }
  }

  validateUrl(url: string) {
    if (!url) {
      throw new ValidateDtoException(ERRORS.URL_EMPTY.message);
    }
  }

  validateUsages(usages: number) {
    if (typeof usages !== 'number' || usages <= 0) {
      throw new ValidateDtoException(ERRORS.USAGES_INVALID.message);
    }
  }
}
