import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { Cache } from 'cache-manager';
import { time } from 'src/common/utils';

@Injectable()
export class CrawlerService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async findOne(url: string) {
    const contents = await this.getHtml(url);
    return contents;
  }

  async findOneUsingCache(url: string) {
    const cachedContent = await this.cacheManager.get<string>(url);
    if (cachedContent) {
      return cachedContent;
    }

    const contents = await this.getHtml(url);

    await this.cacheManager.set(url, contents, time.FIVE_MINUTE);
    return contents;
  }

  async getHtml(url: string) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const contents = await page.content();
    await browser.close();
    return contents;
  }
}
