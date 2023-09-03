import { Test, TestingModule } from '@nestjs/testing';
import { JobPreferenceController } from './job-preference.controller';

describe('JobPreferenceController', () => {
  let controller: JobPreferenceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobPreferenceController],
    }).compile();

    controller = module.get<JobPreferenceController>(JobPreferenceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
