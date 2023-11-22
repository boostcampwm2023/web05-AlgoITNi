import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ResponseCodeBlockDto } from '../run/dto/response-codeblock.dto';
import { ConfigService } from '@nestjs/config';
import { calcExpireSeconds } from '../common/utils';

@Injectable()
export class RedisService {
  private logger = new Logger(RedisService.name);
  private statistic_delay_time = [];
  private runningRequest = 0;
  private readonly refreshExpire;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {
    this.refreshExpire = calcExpireSeconds(
      this.configService.get<string>('JWT_REFRESH_EXPIRE'),
    );
  }

  delay = (delay) => {
    return new Promise((resolve) => setTimeout(resolve, delay));
  };

  async getCompletedJob(jobID): Promise<ResponseCodeBlockDto> {
    this.runningRequest++;
    // this.logger.debug(this.runningRequest)
    this.logger.log(`try to get result to redis completedJob:${jobID}`);
    const maxTrial = 1000;
    const getData = async () =>
      await this.cacheManager.get<ResponseCodeBlockDto>(
        `completedJob:${jobID}`,
      );

    let result;
    const interval = 50 * (Math.floor(this.runningRequest / 10) + 1);
    this.statistic_delay_time.push(interval);

    for (let i = 0; i < maxTrial; i++) {
      await this.delay(interval);
      result = await getData();
      if (result !== null) {
        this.runningRequest--;
        this.logger.debug(`trial: ${i}, delay time : ${interval}ms`);
        // this.logger.debug(this.runningRequest)
        return result;
      }
    }
    this.logger.warn(maxTrial);

    this.runningRequest--;
    return result;
  }
  showTrialTimeAvg() {
    const avgTime =
      this.statistic_delay_time.reduce((sum, curr) => {
        return sum + curr;
      }, 0) / this.statistic_delay_time.length;
    this.statistic_delay_time = [];
    return avgTime;
  }

  async storeRefreshToken(userId: number, refreshToken: string) {
    this.cacheManager.set(
      `refresh:${userId}`,
      refreshToken,
      this.refreshExpire,
    );
  }

  async getRefreshToken(userId: number) {
    return this.cacheManager.get<string>(`refresh:${userId}`);
  }

  async delRefreshToken(userId: number) {
    this.cacheManager.del(`refresh:${userId}`);
  }
}
