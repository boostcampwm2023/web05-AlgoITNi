import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Body, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { REDIS, SOCKET_EVENT } from '../common/utils';
import { ResponseCodeBlockDto } from './dto/response-codeblock.dto';
import { RequestRunPipe } from './pipes/saveCode.pipe';
import { RequestCodeBlockDto } from './dto/request-codeblock.dto';
import { RunService } from './run.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@WebSocketGateway({ namespace: SOCKET_EVENT.NAME_SPACE, cors: true })
export class RunGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(RunGateway.name);
  private connectedSockets: Map<
    string,
    { socket: Socket; createTime: number }
  > = new Map();
  private jobSocketInfo: Map<string | number, string> = new Map();
  private redis: Redis;

  constructor(
    private configService: ConfigService,
    private runService: RunService,
  ) {
    this.redis = new Redis({
      port: configService.get<number>('REDIS_PORT'),
      host: configService.get<string>('REDIS_HOST'),
      password: configService.get<string>('REDIS_PASSWORD'),
    });
    this.initSubscribe();
  }

  initSubscribe() {
    this.redis.subscribe(REDIS.CHANNEL, (err) => {
      if (err) {
        this.logger.error('failed to subscribe redis channel');
      } else {
        this.logger.log(`Subscribed successfully!`);
      }
    });

    this.redis.on('message', (channel, message) => {
      this.logger.debug(`Received from channel : ${channel}`);
      const result = JSON.parse(message);
      const socketID = this.jobSocketInfo.get(result.jobID);
      if (!socketID) return;

      result.socketID = socketID;
      this.jobSocketInfo.delete(result.jobID);
      const socketInfo = this.connectedSockets.get(result.socketID);
      if (!socketInfo) return;
      const socket = socketInfo.socket;
      const response = new ResponseCodeBlockDto(
        result.statusCode,
        result.result,
        result.message,
      );
      socket.emit(SOCKET_EVENT.DONE, response);
    });
  }

  handleConnection(socket: Socket) {
    this.logger.log(`connected: ${socket.id}`);
    this.connectedSockets.set(socket.id, {
      socket: socket,
      createTime: Date.now(),
    });
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.connectedSockets.delete(socket.id);
  }

  @SubscribeMessage(SOCKET_EVENT.REQUEST)
  async requestRunCode(
    @ConnectedSocket() socket: Socket,
    @Body(RequestRunPipe) codeBlock: RequestCodeBlockDto,
  ) {
    const jobID = await this.runService.requestRunningMQPubSub(codeBlock);
    this.jobSocketInfo.set(jobID, socket.id);
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  handleNotCompleteSocket() {
    const Before20S = Date.now() - 20000;
    this.connectedSockets.forEach((value, key) => {
      const { socket, createTime } = value;
      if (createTime < Before20S) this.connectedSockets.delete(key);
      socket.disconnect();
    });
  }
}
