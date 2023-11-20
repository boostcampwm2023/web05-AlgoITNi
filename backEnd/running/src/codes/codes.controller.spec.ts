import { Test, TestingModule } from '@nestjs/testing';
import { CodesController } from './codes.controller';
import { CodesService } from './codes.service';

describe('CodesController', () => {
  let controller: CodesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CodesController],
      providers: [CodesService],
    }).compile();

    controller = module.get<CodesController>(CodesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
