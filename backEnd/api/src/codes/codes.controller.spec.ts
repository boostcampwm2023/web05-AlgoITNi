import { Test, TestingModule } from '@nestjs/testing';
import { CodesController } from './codes.controller';

describe('CodesController', () => {
  let controller: CodesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CodesController],
    }).compile();

    controller = module.get<CodesController>(CodesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
