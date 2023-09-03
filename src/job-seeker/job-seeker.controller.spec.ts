import { Test, TestingModule } from '@nestjs/testing';
import { JobSeekerController } from './job-seeker.controller';

describe('JobSeekerController', () => {
  let controller: JobSeekerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobSeekerController],
    }).compile();

    controller = module.get<JobSeekerController>(JobSeekerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
