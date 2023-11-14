import { Test, TestingModule } from '@nestjs/testing';
import { RunService } from './run.service';

describe('RunService', () => {
  let service: RunService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RunService],
    }).compile();

    service = module.get<RunService>(RunService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
