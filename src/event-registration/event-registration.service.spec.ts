import { Test, TestingModule } from '@nestjs/testing';
import { EventRegistrationService } from './event-registration.service';

describe('EventRegistrationService', () => {
  let service: EventRegistrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventRegistrationService],
    }).compile();

    service = module.get<EventRegistrationService>(EventRegistrationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
