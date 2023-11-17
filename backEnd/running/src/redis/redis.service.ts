import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  private logger = new Logger(RedisService.name);
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  async addCompletedJob(jobID: string | number, data: string[]) {
    this.logger.log(`add result to redis completedJob:${jobID}`);
    this.cacheManager.set(`completedJob:${jobID}`, data);
  }
}
