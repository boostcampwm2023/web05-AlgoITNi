import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  private logger = new Logger(RedisService.name);
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  async addCompletedJob(jobID, data) {
    this.logger.log(`add result to redis completedJob:${jobID}`);
    this.cacheManager.set(`completedJob:${jobID}`, data);
  }
  async getCompletedJob(jobID): Promise<{ data: string }> {
    this.logger.log(`try to get result to redis completedJob:${jobID}`);
    const maxTrial = 10000;
    const getData = async () =>
      await this.cacheManager.get<{ data: string }>(`completedJob:${jobID}`);
    let result = await getData();
    if (result !== null) return result;
    for (let i = 0; i < maxTrial; i++) {
      result = await getData();
      if (result !== null) return result;
      // TODO interval
    }
    this.logger.warn(maxTrial);
    return result;
  }
}
