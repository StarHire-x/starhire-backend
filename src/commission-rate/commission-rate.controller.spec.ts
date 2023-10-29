import { Test, TestingModule } from '@nestjs/testing';
import { CommissionRateController } from './commission-rate.controller';
import { CommissionRateService } from './commission-rate.service';

describe('CommissionRateController', () => {
  let controller: CommissionRateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommissionRateController],
      providers: [CommissionRateService],
    }).compile();

    controller = module.get<CommissionRateController>(CommissionRateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
