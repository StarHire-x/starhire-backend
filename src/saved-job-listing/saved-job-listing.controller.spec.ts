import { Test, TestingModule } from '@nestjs/testing';
import { SavedJobListingController } from './saved-job-listing.controller';
import { SavedJobListingService } from './saved-job-listing.service';

describe('SavedJobListingController', () => {
  let controller: SavedJobListingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SavedJobListingController],
      providers: [SavedJobListingService],
    }).compile();

    controller = module.get<SavedJobListingController>(SavedJobListingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
