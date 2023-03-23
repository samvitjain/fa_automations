import { Test, TestingModule } from '@nestjs/testing';
import { AsanaService } from './asana.service';

describe('AsanaService', () => {
  let service: AsanaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AsanaService],
    }).compile();

    service = module.get<AsanaService>(AsanaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
