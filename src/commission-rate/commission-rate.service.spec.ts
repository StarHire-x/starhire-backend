import { Test, TestingModule } from '@nestjs/testing';
import { CommissionRateService } from './commission-rate.service';

describe('CommissionRateService', () => {
  let service: CommissionRateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommissionRateService],
    }).compile();

    service = module.get<CommissionRateService>(CommissionRateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
