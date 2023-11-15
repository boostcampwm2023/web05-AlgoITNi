import { Test, TestingModule } from '@nestjs/testing';
import { CodesService } from './codes.service';

describe('CodesService', () => {
  let service: CodesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CodesService],
    }).compile();

    service = module.get<CodesService>(CodesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
