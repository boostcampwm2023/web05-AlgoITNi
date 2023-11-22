import { Test, TestingModule } from '@nestjs/testing';
import { CrawlerController } from './crawler.controller';
import { CrawlerService } from './crawler.service';

describe('CrawlerController', () => {
  let controller: CrawlerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CrawlerController],
      providers: [CrawlerService],
    }).compile();

    controller = module.get<CrawlerController>(CrawlerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
