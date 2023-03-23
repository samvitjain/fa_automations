import { Test, TestingModule } from '@nestjs/testing';
import { AsanaController } from './asana.controller';

describe('AsanaController', () => {
  let controller: AsanaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AsanaController],
    }).compile();

    controller = module.get<AsanaController>(AsanaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
