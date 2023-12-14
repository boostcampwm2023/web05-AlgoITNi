import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ResponseCodeBlockDto } from '../mq/dto/response-codeblock.dto';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { REDIS } from '../common/utils';

@Injectable()
export class RedisService {
  private logger = new Logger(RedisService.name);
  private redis: Redis;
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {
    this.redis = new Redis({
      host: configService.get<string>('REDIS_HOST'),
      port: configService.get<number>('REDIS_PORT'),
      password: configService.get<string>('REDIS_PASSWORD'),
    });
  }
  async addCompletedJob(jobID: string | number, data: ResponseCodeBlockDto) {
    this.logger.log(`add result to redis completedJob:${jobID}`);
    return this.cacheManager.set(`completedJob:${jobID}`, data);
  }

  async publish(jobID: string | number, data: ResponseCodeBlockDto) {
    data.jobID = jobID;
    this.redis.publish(REDIS.CHANNEL, JSON.stringify(data));
  }
}
