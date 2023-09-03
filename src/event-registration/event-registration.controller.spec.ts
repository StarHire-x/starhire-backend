import { Test, TestingModule } from '@nestjs/testing';
import { EventRegistrationController } from './event-registration.controller';
import { EventRegistrationService } from './event-registration.service';

describe('EventRegistrationController', () => {
  let controller: EventRegistrationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventRegistrationController],
      providers: [EventRegistrationService],
    }).compile();

    controller = module.get<EventRegistrationController>(EventRegistrationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
