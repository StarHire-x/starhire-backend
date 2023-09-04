import { Test, TestingModule } from '@nestjs/testing';
import { CorporateController } from './corporate.controller';
import { CorporateService } from './corporate.service';

describe('CorporateController', () => {
  let controller: CorporateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CorporateController],
      providers: [CorporateService],
    }).compile();

    controller = module.get<CorporateController>(CorporateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
