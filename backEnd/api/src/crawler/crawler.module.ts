import { Module } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { CrawlerController } from './crawler.controller';

@Module({
  controllers: [CrawlerController],
  providers: [CrawlerService],
})
export class CrawlerModule {}
