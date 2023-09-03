import { Test, TestingModule } from '@nestjs/testing';
import { JobApplicationController } from './job-application.controller';
import { JobApplicationService } from './job-application.service';

describe('JobApplicationController', () => {
  let controller: JobApplicationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobApplicationController],
      providers: [JobApplicationService],
    }).compile();

    controller = module.get<JobApplicationController>(JobApplicationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
