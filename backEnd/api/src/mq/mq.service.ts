import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ConfigService } from '@nestjs/config';
import { RequestCodeBlockDto } from '../run/dto/request-codeblock.dto';
import Redis from 'ioredis';
import { EVENT, REDIS } from '../common/utils';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class MqService {
  private logger = new Logger(MqService.name);
  private redis;
  private jobSocketInfo = new Map<string | number, string>();
  constructor(
    @InjectQueue('runningRequest') private queue: Queue,
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
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
      // event emit -> gateWay (message, socketID)
      const socketID = this.jobSocketInfo.get(result.jobID);
      if (socketID) {
        result.socketID = socketID;
        this.eventEmitter.emit(EVENT.COMPLETE, result);
      }
    });
  }

  async addMessage(data: RequestCodeBlockDto) {
    const job = await this.queue.add(REDIS.QUEUE, data, {
      removeOnComplete: true,
    });
    this.logger.log(`push to task Queue ${job.id}`);
    return job;
  }

  setInfo(jobID: string | number, socketID: string) {
    this.jobSocketInfo.set(jobID, socketID);
  }
}
