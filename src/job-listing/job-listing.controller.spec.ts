import { Test, TestingModule } from '@nestjs/testing';
import { JobListingController } from './job-listing.controller';
import { JobListingService } from './job-listing.service';

describe('JobListingController', () => {
  let controller: JobListingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobListingController],
      providers: [JobListingService],
    }).compile();

    controller = module.get<JobListingController>(JobListingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
