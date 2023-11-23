import { Module } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { CrawlerController } from './crawler.controller';
import { cacheModule } from '../redis/redis.module';

@Module({
  imports: [cacheModule],
  controllers: [CrawlerController],
  providers: [CrawlerService],
})
export class CrawlerModule {}
