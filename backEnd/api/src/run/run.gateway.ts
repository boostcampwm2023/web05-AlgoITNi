import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENT } from '../common/utils';
import { ResponseCodeBlockDto } from './dto/response-codeblock.dto';

@WebSocketGateway({ namespace: 'run', cors: true })
export class RunGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(RunGateway.name);
  private connectedSockets: Map<string, Socket> = new Map();
  private subscriberClient: Redis;

  constructor(private configService: ConfigService) {
    this.subscriberClient = new Redis({
      port: configService.get<number>('REDIS_PORT'),
      host: configService.get<string>('REDIS_HOST'),
      password: configService.get<string>('REDIS_PASSWORD'),
    });
  }

  handleConnection(socket: Socket) {
    this.logger.log(`connected: ${socket.id}`);
    this.connectedSockets.set(socket.id, socket);
    socket.emit('connected', { id: socket.id });
    socket.on('disconnect', () => {
      this.connectedSockets.delete(socket.id);
    });
  }

  @OnEvent(EVENT.COMPLETE)
  answer(data) {
    this.logger.log('received running result');
    const socket = this.connectedSockets.get(data.socketID);
    const response = new ResponseCodeBlockDto(
      data.statusCode,
      data.result,
      data.message,
    );
    socket.emit('done', response);
  }
}
