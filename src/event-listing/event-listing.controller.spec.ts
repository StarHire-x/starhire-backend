import { Test, TestingModule } from '@nestjs/testing';
import { EventListingController } from './event-listing.controller';
import { EventListingService } from './event-listing.service';

describe('EventListingController', () => {
  let controller: EventListingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventListingController],
      providers: [EventListingService],
    }).compile();

    controller = module.get<EventListingController>(EventListingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
