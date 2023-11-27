import { Test, TestingModule } from '@nestjs/testing';
import { WebRtcService } from './web-rtc.service';

describe('WebRtcService', () => {
  let service: WebRtcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebRtcService],
    }).compile();

    service = module.get<WebRtcService>(WebRtcService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
