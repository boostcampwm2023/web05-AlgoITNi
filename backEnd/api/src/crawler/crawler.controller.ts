import { Controller, Get, Query } from '@nestjs/common';
import { CrawlerService } from './crawler.service';

@Controller()
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Get('/crawler')
  async crawling(@Query('url') url: string) {
    const content = await this.crawlerService.findOne(url);
    return content;
  }

  @Get('/nginx')
  async nginxCaching(@Query('url') url: string) {
    const content = await this.crawlerService.findOne(url);
    return content;
  }

  @Get('/crawler/v1')
  async crawlingV1(@Query('url') url: string) {
    const content = await this.crawlerService.findOne(url);
    return content;
  }

  @Get('/crawler/v2')
  async crawlingV2(@Query('url') url: string) {
    const content = await this.crawlerService.findOneUsingCache(url);
    return content;
  }
}
