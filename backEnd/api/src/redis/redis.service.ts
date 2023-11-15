import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  private logger = new Logger(RedisService.name);
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getCompletedJob(jobID): Promise<string | string[]> {
    this.logger.log(`try to get result to redis completedJob:${jobID}`);
    const maxTrial = 100;
    const getData = async () =>
      await this.cacheManager.get<string | string[]>(`completedJob:${jobID}`);
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
