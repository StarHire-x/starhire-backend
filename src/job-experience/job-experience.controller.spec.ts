import { Test, TestingModule } from '@nestjs/testing';
import { JobExperienceController } from './job-experience.controller';
import { JobExperienceService } from './job-experience.service';

describe('JobExperienceController', () => {
  let controller: JobExperienceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobExperienceController],
      providers: [JobExperienceService],
    }).compile();

    controller = module.get<JobExperienceController>(JobExperienceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
