import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ConfigService } from '@nestjs/config';
import { RequestCodeblockDto } from '../run/dto/request-codeblock.dto';
import Redis from 'ioredis';
import { REDIS } from '../common/utils';

@Injectable()
export class MqService {
  private logger = new Logger(MqService.name);
  private redis;
  private jobSocketInfo = new Map<string | number, string>();
  constructor(
    @InjectQueue('runningRequest') private queue: Queue,
    private configService: ConfigService,
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
      this.logger.debug(`Received ${message} from ${channel}`);
      const result = JSON.parse(message);
      // event emit -> gateWay (message, socketID)
      const socketID = this.jobSocketInfo.get(result.jobID);
      if (socketID) {
      }
    });
  }

  async addMessage(data: RequestCodeblockDto) {
    const job = await this.queue.add(REDIS.QUEUE, data.code, {
      removeOnComplete: true,
    });
    this.logger.log(`push to task Queue ${job.id}`);
    return job;
  }

  setInfo(jobID: string | number, socketID: string) {
    this.jobSocketInfo.set(jobID, socketID);
  }
}
