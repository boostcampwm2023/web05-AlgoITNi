import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';

@Injectable()
export class CrawlerService {
  async findOne(url: string) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);

    const contents = await page.content();

    await browser.close();
    return contents;
  }
}
