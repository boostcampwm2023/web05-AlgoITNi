import { Test, TestingModule } from '@nestjs/testing';
import { RunService } from './run.service';
import { ConfigService } from '@nestjs/config';

describe('RunService', () => {
  let service: RunService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService, RunService],
    }).compile();

    service = module.get<RunService>(RunService);
  });

  it('should be defined', () => {
    const result = service.securityCheck("print('a')");
    expect(result).toBe(1);
  });
});
