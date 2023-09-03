import { Test, TestingModule } from '@nestjs/testing';
import { AdministratorService } from './admin.service';

describe('AdministratorsService', () => {
  let service: AdministratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdministratorService],
    }).compile();

    service = module.get<AdministratorService>(AdministratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
