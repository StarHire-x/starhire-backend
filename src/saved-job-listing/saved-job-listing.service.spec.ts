import { Test, TestingModule } from '@nestjs/testing';
import { SavedJobListingService } from './saved-job-listing.service';

describe('SavedJobListingService', () => {
  let service: SavedJobListingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SavedJobListingService],
    }).compile();

    service = module.get<SavedJobListingService>(SavedJobListingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
