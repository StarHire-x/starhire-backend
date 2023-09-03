import { Test, TestingModule } from '@nestjs/testing';
import { EventListingService } from './event-listing.service';

describe('EventListingService', () => {
  let service: EventListingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventListingService],
    }).compile();

    service = module.get<EventListingService>(EventListingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
