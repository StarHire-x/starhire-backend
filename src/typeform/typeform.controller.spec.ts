import { Test, TestingModule } from '@nestjs/testing';
import { TypeformController } from './typeform.controller';
import { TypeformService } from './typeform.service';

describe('TypeformController', () => {
  let controller: TypeformController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypeformController],
      providers: [TypeformService],
    }).compile();

    controller = module.get<TypeformController>(TypeformController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
