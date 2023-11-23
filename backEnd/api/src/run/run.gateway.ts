import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({ namespace: 'run', cors: true })
export class RunGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger();
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
  }

  @SubscribeMessage('job-complete')
  handleEvent(@MessageBody() data, @ConnectedSocket() socket: Socket) {
    return { data, id: socket.id };
  }

  answer() {}
}
