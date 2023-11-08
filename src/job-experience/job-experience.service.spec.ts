import { Test, TestingModule } from '@nestjs/testing';
import { JobExperienceService } from './job-experience.service';
import { DeleteResult, Repository } from 'typeorm';
import { JobSeeker } from '../entities/jobSeeker.entity';
import { JobExperience } from '../entities/jobExperience.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateJobExperienceDto } from './dto/create-job-experience.dto';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';

describe('JobExperienceService', () => {
  let jobExperienceService: JobExperienceService;
  let jobSeekerRepository: Repository<JobSeeker>;
  let jobExperienceRepository: Repository<JobExperience>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobExperienceService,
        {
          provide: getRepositoryToken(JobSeeker),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(JobExperience),
          useClass: Repository,
        },
      ],
    }).compile();

    jobExperienceService =
      module.get<JobExperienceService>(JobExperienceService);
    jobSeekerRepository = module.get<Repository<JobSeeker>>(
      getRepositoryToken(JobSeeker),
    );
    jobExperienceRepository = module.get<Repository<JobExperience>>(
      getRepositoryToken(JobExperience),
    );
  });

  it('should be defined', () => {
    expect(jobExperienceService).toBeDefined();
    expect(jobSeekerRepository).toBeDefined();
    expect(jobExperienceRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a job experience and return the created job experience', async () => {
      const createJobExperienceDto: CreateJobExperienceDto = {
        jobSeekerId: 'test',
        jobTitle: 'testJob',
        employerName: 'GIC Pte Ltd',
        jobDescription: 'description',
        startDate: new Date('2023-12-12'),
        endDate: new Date('2024-12-12'),
      };

      const jobSeeker = new JobSeeker({
        userId: 'test',
      })

      const jobExperience = new JobExperience({
        jobTitle: 'testJob',
        employerName: 'GIC Pte Ltd',
        jobDescription: 'description',
        startDate: new Date('2023-12-12'),
        endDate: new Date('2024-12-12'),
        jobSeeker: jobSeeker,
      });

      jest.spyOn(jobSeekerRepository, 'findOneBy').mockResolvedValueOnce(jobSeeker);

      jest
        .spyOn(jobExperienceRepository, 'save')
        .mockResolvedValueOnce(jobExperience);

       const result = await jobExperienceService.create(createJobExperienceDto);

       expect(result).toEqual({
         statusCode: HttpStatus.OK,
         message: 'Job experience is created',
         data: jobExperience,
       });
    })

    it('should throw error if job seeker id is invalid', async () => {
      const createJobExperienceDto: CreateJobExperienceDto = {
        jobSeekerId: 'test',
        jobTitle: 'testJob',
        employerName: 'GIC Pte Ltd',
        jobDescription: 'description',
        startDate: new Date('2023-12-12'),
        endDate: new Date('2024-12-12'),
      };

      const jobSeeker = new JobSeeker({
        userId: 'test',
      });

      const jobExperience = new JobExperience({
        jobTitle: 'testJob',
        employerName: 'GIC Pte Ltd',
        jobDescription: 'description',
        startDate: new Date('2023-12-12'),
        endDate: new Date('2024-12-12'),
        jobSeeker: jobSeeker,
      });

      jest
        .spyOn(jobSeekerRepository, 'findOneBy')
        .mockResolvedValueOnce(null);

      await expect(jobExperienceService.create(createJobExperienceDto)).rejects.toThrow(
        new NotFoundException('Job Seeker Id provided is not valid')
      );
    });
  })

  describe('findAll', () => {
    it('should return an array of job experiences', async () => {
      const jobExperience1 = new JobExperience({
        jobExperienceId: 1
      })

      const jobExperience2 = new JobExperience({
        jobExperienceId: 2,
      });

      const jobExperiences = [jobExperience1,jobExperience2];
      
      jest
        .spyOn(jobExperienceRepository, 'find')
        .mockResolvedValueOnce(jobExperiences);

      const result = await jobExperienceService.findAll();

      expect(result).toEqual([
        {
          jobExperienceId: 1,
        },
        {
          jobExperienceId: 2,
        },
      ]);
    });

    it('should throw an error if unable to fetch job experiences', async () => {
      jest
        .spyOn(jobExperienceRepository, 'find')
        .mockRejectedValueOnce(new Error('Database error'));

      await expect(jobExperienceService.findAll()).rejects.toThrow(
        new HttpException(
          'Failed to fetch job experiences',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('findOne', () => {
    it('should return a job experience if found', async () => {
      const jobExperienceId = 1;
      const jobExperience = new JobExperience({
        jobExperienceId: jobExperienceId,
        jobTitle: 'Software Engineer',
      });

      jest
        .spyOn(jobExperienceRepository, 'findOne')
        .mockResolvedValueOnce(jobExperience);

      const result = await jobExperienceService.findOne(jobExperienceId);

      expect(result).toEqual(jobExperience);
    });

    it('should throw NotFoundException if job experience not found', async () => {
      const jobExperienceId = 1;

      jest
        .spyOn(jobExperienceRepository, 'findOne')
        .mockResolvedValueOnce(null);

      await expect(
        jobExperienceService.findOne(jobExperienceId),
      ).rejects.toThrow(new NotFoundException('Job experience not found'));
    });

    it('should throw HttpException if database error occurs', async () => {
      const jobExperienceId = 1;

      jest
        .spyOn(jobExperienceRepository, 'findOne')
        .mockRejectedValueOnce(new Error('Database error'));

      await expect(
        jobExperienceService.findOne(jobExperienceId),
      ).rejects.toThrow(
        new HttpException('Database error', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('findByJobSeekerId', () => {
    it('should return job experiences if job seeker is found', async () => {
      const jobSeekerId = 'test';
      const jobExperiences = [
        new JobExperience({ jobTitle: 'Software Engineer' }),
        new JobExperience({ jobTitle: 'Data Scientist' }),
      ];
      const jobSeeker = new JobSeeker({
        userId: jobSeekerId,
        jobExperiences: jobExperiences,
      });

      jest
        .spyOn(jobSeekerRepository, 'findOne')
        .mockResolvedValueOnce(jobSeeker);

      const result = await jobExperienceService.findByJobSeekerId(jobSeekerId);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Job experience is found',
        data: jobExperiences,
      });
    });

    it('should throw NotFoundException if job seeker is not found', async () => {
      const jobSeekerId = 'test';

      jest.spyOn(jobSeekerRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(
        jobExperienceService.findByJobSeekerId(jobSeekerId),
      ).rejects.toThrow(
        new NotFoundException('Job Seeker Id provided is not valid'),
      );
    });

    it('should throw HttpException if database error occurs', async () => {
      const jobSeekerId = 'test';

      jest
        .spyOn(jobSeekerRepository, 'findOne')
        .mockRejectedValueOnce(new Error('Database error'));

      await expect(
        jobExperienceService.findByJobSeekerId(jobSeekerId),
      ).rejects.toThrow(
        new HttpException('Database error', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('update', () => {
    it('should update job experience and return the updated job experience', async () => {
      const id = 1;
      const updateJobExperienceDto = {
        jobSeekerId: 'test',
        jobTitle: 'New Job Title',
      };
      const jobExperience = new JobExperience({
        jobExperienceId: id,
        jobTitle: 'New Job Title',
      });

      jest
        .spyOn(jobExperienceService, 'findOne')
        .mockResolvedValueOnce(jobExperience);

      jest.spyOn(jobExperienceRepository, 'save').mockResolvedValueOnce(jobExperience);

      const result = await jobExperienceService.update(
        id,
        updateJobExperienceDto,
      );

      expect(result).toEqual({
        statusCode: 200,
        message: 'Job preference updated',
        data: {
          jobExperienceId: id,
          jobTitle: 'New Job Title',
        },
      });
    });

    it('should throw NotFoundException if job experience is not found', async () => {
      const id = 1;
      const updateJobExperienceDto = {
        jobSeekerId: 'test',
        jobTitle: 'New Job Title',
      };

      jest.spyOn(jobExperienceService, 'findOne').mockResolvedValueOnce(null);

      await expect(
        jobExperienceService.update(id, updateJobExperienceDto),
      ).rejects.toThrow(
        new NotFoundException('Job Experience Id provided is not valid'),
      );
    });
  });

  describe('remove', () => {
    it('should delete job experience and return result', async () => {
      const id = 1;
      const result = new DeleteResult();
      result.affected = 1;
      result.raw = {};
      jest
        .spyOn(jobExperienceRepository, 'delete')
        .mockResolvedValueOnce(result);

      const response = await jobExperienceService.remove(id);
      expect(response).toEqual(result);
    });

    it('should throw a not found exception if job experience is not found', async () => {
      const id = 1;
      const result = new DeleteResult();
      result.affected = 0;
      result.raw = {};
      jest.spyOn(jobExperienceRepository, 'delete').mockResolvedValue(result);
      await expect(jobExperienceService.remove(id)).rejects.toThrow(
        new HttpException('Job experience id not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw a bad request exception if there is a database error', async () => {
      const id = 1;
      jest
        .spyOn(jobExperienceRepository, 'delete')
        .mockRejectedValue(new Error('Database error'));
      await expect(jobExperienceService.remove(id)).rejects.toThrow(
        new HttpException('Database error', HttpStatus.BAD_REQUEST),
      );
    });
  });
});
