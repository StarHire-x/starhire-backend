import { Test, TestingModule } from '@nestjs/testing';
import { TypeformService } from './typeform.service';

describe('TypeformService', () => {
  let service: TypeformService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypeformService],
    }).compile();

    service = module.get<TypeformService>(TypeformService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
