import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { JoinRoomDto } from 'src/connections/dto/join-room.dto';
import {
  URLNotFoundException,
  ValidateDtoException,
} from 'src/common/exception/exception';
import { ERRORS, EVENT, USE_FULL } from 'src/common/utils';
import { ResponseDto } from 'src/common/dto/common-response.dto';

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
    const minUsages = this.serverToCpus.get(nextServer) || USE_FULL;

    if (usages < minUsages) {
      this.returnUrl = url;
    }

    this.serverToCpus.set(url, usages);
  }

  findServer(data: JoinRoomDto): ResponseDto {
    const { roomName } = data;
    this.validateRoom(roomName);

    const isServer = this.roomToUrl.get(roomName);

    if (isServer) {
      const response = this.createResponse(HttpStatus.OK, { url: isServer });
      return response;
    }

    const server = this.returnUrl;

    if (!server) {
      throw new URLNotFoundException(ERRORS.URL_NOT_FOUND.message);
    }

    this.roomToUrl.set(roomName, server);
    const response = this.createResponse(HttpStatus.OK, { url: server });
    return response;
  }

  leaveRoom(data: JoinRoomDto): ResponseDto {
    const { roomName } = data;
    this.validateRoom(roomName);
    this.roomToUrl.delete(roomName);
    const response = this.createResponse(HttpStatus.OK, { room: roomName });
    return response;
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

  createResponse(statusCode: number, result: object): ResponseDto {
    const response = new ResponseDto();
    response.statusCode = statusCode;
    response.result = result;
    response.timestamp = new Date().toISOString();
    return response;
  }
}
