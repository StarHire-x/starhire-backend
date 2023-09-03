import { Test, TestingModule } from '@nestjs/testing';
import { JobPreferenceService } from './job-preference.service';

describe('JobPreferenceService', () => {
  let service: JobPreferenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobPreferenceService],
    }).compile();

    service = module.get<JobPreferenceService>(JobPreferenceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
