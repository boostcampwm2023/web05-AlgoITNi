import { Test, TestingModule } from '@nestjs/testing';
import { MqService } from './mq.service';

describe('MqService', () => {
  let service: MqService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MqService],
    }).compile();

    service = module.get<MqService>(MqService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
