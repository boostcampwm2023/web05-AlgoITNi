import { Controller, Get, Query } from '@nestjs/common';
import { CrawlerService } from './crawler.service';

@Controller('crawler')
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Get()
  async crawling(@Query('url') url: string) {
    const content = await this.crawlerService.findOne(url);
    return content;
  }

  @Get('v1')
  async crawlingV1(@Query('url') url: string) {
    const content = await this.crawlerService.findOne(url);
    return content;
  }

  @Get('v2')
  async crawlingV2(@Query('url') url: string) {
    const content = await this.crawlerService.findOneUsingCache(url);
    return content;
  }
}
