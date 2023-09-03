import { Test, TestingModule } from '@nestjs/testing';
import { JobListingService } from './job-listing.service';

describe('JobListingService', () => {
  let service: JobListingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobListingService],
    }).compile();

    service = module.get<JobListingService>(JobListingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
