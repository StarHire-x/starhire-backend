import { Test, TestingModule } from '@nestjs/testing';
import { JobPreferenceService } from './job-preference.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { JobSeeker } from '../entities/jobSeeker.entity';
import { JobPreference } from '../entities/jobPreference.entity';
import { Corporate } from '../entities/corporate.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateJobPreferenceDto } from './dto/create-job-preference.dto';
import UserRoleEnum from '../enums/userRole.enum';
import { UpdateJobPreferenceDto } from './dto/update-job-preference.dto';

describe('JobPreferenceService', () => {
  let jobPreferenceService: JobPreferenceService;
  let jobSeekerRepository: Repository<JobSeeker>;
  let jobPreferenceRepository: Repository<JobPreference>;
  let corporateRepository: Repository<Corporate>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobPreferenceService,
        {
          provide: getRepositoryToken(JobSeeker),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(JobPreference),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Corporate),
          useClass: Repository,
        },
      ],
    }).compile();

    jobPreferenceService =
      module.get<JobPreferenceService>(JobPreferenceService);
    jobSeekerRepository = module.get<Repository<JobSeeker>>(
      getRepositoryToken(JobSeeker),
    );
    jobPreferenceRepository = module.get<Repository<JobPreference>>(
      getRepositoryToken(JobPreference),
    );
    corporateRepository = module.get<Repository<Corporate>>(
      getRepositoryToken(Corporate),
    );
  });

  it('should be defined', () => {
    expect(jobPreferenceService).toBeDefined();
    expect(jobSeekerRepository).toBeDefined();
    expect(jobPreferenceRepository).toBeDefined();
    expect(corporateRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a job preference for a job seeker and return the created job preference', async () => {
      const createJobPreferenceDto: CreateJobPreferenceDto = {
        jobSeekerId: '1',
        corporateId: '',
        benefitPreference: 3,
        salaryPreference: 3,
        workLifeBalancePreference: 4,
      };

      const jobSeeker = new JobSeeker({
        userId: '1',
      });

      const jobPreference = new JobPreference({
        benefitPreference: 3,
        salaryPreference: 3,
        workLifeBalancePreference: 4,
        jobSeeker: jobSeeker,
      });

      jest
        .spyOn(jobSeekerRepository, 'findOneBy')
        .mockResolvedValueOnce(jobSeeker);
      jest
        .spyOn(jobPreferenceRepository, 'save')
        .mockResolvedValueOnce(jobPreference);

      const result = await jobPreferenceService.create(createJobPreferenceDto);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Job preference is created for job seeker',
        data: jobPreference,
      });
    });

    it('should throw an error if job seeker already has a job preference', async () => {
      const createJobPreferenceDto: CreateJobPreferenceDto = {
        jobSeekerId: '1',
        corporateId: '',
        benefitPreference: 3,
        salaryPreference: 3,
        workLifeBalancePreference: 4,
      };

      const jobPreference = new JobPreference({
        jobPreferenceId: 1,
        benefitPreference: 3,
        salaryPreference: 3,
        workLifeBalancePreference: 4,
      });

      const jobSeeker = new JobSeeker({
        userId: '1',
      });

      jobSeeker.jobPreference = jobPreference;

      jest
        .spyOn(jobSeekerRepository, 'findOneBy')
        .mockResolvedValueOnce(jobSeeker);

      await expect(
        jobPreferenceService.create(createJobPreferenceDto),
      ).rejects.toThrow('Job Seeker already has a Job Preference!');
    });

    it('should create a job preference for a corporate and return the created job preference', async () => {
      const createJobPreferenceDto: CreateJobPreferenceDto = {
        jobSeekerId: '',
        corporateId: '1',
        benefitPreference: 3,
        salaryPreference: 3,
        workLifeBalancePreference: 4,
      };

      const corporate = new Corporate({
        userId: '1',
      });

      const jobPreference = new JobPreference({
        benefitPreference: 3,
        salaryPreference: 3,
        workLifeBalancePreference: 4,
        corporate: corporate,
      });

      jest
        .spyOn(corporateRepository, 'findOneBy')
        .mockResolvedValueOnce(corporate);
      jest
        .spyOn(jobPreferenceRepository, 'save')
        .mockResolvedValueOnce(jobPreference);

      const result = await jobPreferenceService.create(createJobPreferenceDto);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Job preference is created for corporate',
        data: jobPreference,
      });
    });

    it('should throw an error if corporate already has a job preference', async () => {
      const createJobPreferenceDto: CreateJobPreferenceDto = {
        jobSeekerId: '',
        corporateId: '1',
        benefitPreference: 3,
        salaryPreference: 3,
        workLifeBalancePreference: 4,
      };

      const jobPreference = new JobPreference({
        jobPreferenceId: 1,
        benefitPreference: 3,
        salaryPreference: 3,
        workLifeBalancePreference: 4,
      });

      const corporate = new Corporate({
        userId: '1',
      });

      corporate.jobPreference = jobPreference;

      jest
        .spyOn(corporateRepository, 'findOneBy')
        .mockResolvedValueOnce(corporate);

      await expect(
        jobPreferenceService.create(createJobPreferenceDto),
      ).rejects.toThrow('Corporate already has a Job Preference!');
    });

    it('should throw an error if both corporate id and jobseeker id empty', async () => {
      const createJobPreferenceDto: CreateJobPreferenceDto = {
        jobSeekerId: '',
        corporateId: '',
        benefitPreference: 3,
        salaryPreference: 3,
        workLifeBalancePreference: 4,
      };

      await expect(
        jobPreferenceService.create(createJobPreferenceDto),
      ).rejects.toThrow('Empty user details');
    });
  });

  describe('findAll', () => {
    it('should return all job preference if there are any', async () => {
      const jobPreference1 = new JobPreference({
        jobPreferenceId: 1,
      });
      const jobPreference2 = new JobPreference({
        jobPreferenceId: 2,
      });
      const jobPreferences = [jobPreference1, jobPreference2];

      jest
        .spyOn(jobPreferenceRepository, 'find')
        .mockResolvedValueOnce(jobPreferences);

      const result = await jobPreferenceService.findAll();

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Job Preference found',
        data: jobPreferences,
      });
    });

    it('should return not found if there are no job preference', async () => {
      jest.spyOn(jobPreferenceRepository, 'find').mockResolvedValueOnce([]);

      const result = await jobPreferenceService.findAll();

      expect(result).toEqual({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Job Preference not found',
        data: [],
      });
    });

    it('should throw an error if finding job preference fails', async () => {
      jest
        .spyOn(jobPreferenceRepository, 'find')
        .mockRejectedValueOnce(new Error('Failed to find admin'));

      await expect(jobPreferenceService.findAll()).rejects.toThrow(
        'Failed to find Job Preference',
      );
    });
  });

  describe('findOne', () => {
    it('should return job preference if id exists', async () => {
      const id = 1;
      const admin = new JobPreference({ jobPreferenceId: id });
      jest.spyOn(jobPreferenceRepository, 'findOne').mockResolvedValue(admin);

      const result = await jobPreferenceService.findOne(id);

      expect(result).toEqual(admin);
    });

    it('should throw error if findOne fails', async () => {
      const id = 0;
      jest
        .spyOn(jobPreferenceRepository, 'findOne')
        .mockRejectedValue(new Error('Failed to find job preference'));

      await expect(jobPreferenceService.findOne(id)).rejects.toThrow(
        new HttpException(
          'Failed to find job preference',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should throw an error if job preference with given id is not found', async () => {
      const id = 3;

      jest
        .spyOn(jobPreferenceRepository, 'findOne')
        .mockResolvedValueOnce(null);

      await expect(jobPreferenceService.findOne(id)).rejects.toThrow(
        'Job preference not found',
      );
    });
  });

  describe('findByJobSeekerId', () => {
    it('should find and return a job preference by job seeker id', async () => {
      const jobSeekerId = '1';
      const jobPreference = new JobPreference({
        jobPreferenceId: 1,
        benefitPreference: 3,
        salaryPreference: 3,
        workLifeBalancePreference: 4,
      });
      const jobSeeker = new JobSeeker({ userId: jobSeekerId, jobPreference });

      jest
        .spyOn(jobSeekerRepository, 'findOne')
        .mockResolvedValueOnce(jobSeeker);

      const result = await jobPreferenceService.findByJobSeekerId(jobSeekerId);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Job preference is found',
        data: jobPreference,
      });
    });

    it('should throw an error if job seeker with given id is not found', async () => {
      const jobSeekerId = '1';

      jest.spyOn(jobSeekerRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(
        jobPreferenceService.findByJobSeekerId(jobSeekerId),
      ).rejects.toThrow('Job Seeker Id provided is not valid');
    });

    it('should throw an error if job seeker has no job preference', async () => {
      const jobSeekerId = '3';
      const jobSeeker = new JobSeeker({ userId: jobSeekerId });

      jest
        .spyOn(jobSeekerRepository, 'findOne')
        .mockResolvedValueOnce(jobSeeker);

      await expect(
        jobPreferenceService.findByJobSeekerId(jobSeekerId),
      ).rejects.toThrow('Job Seeker has no existing job preference');
    });
  });

  describe('findPreferenceByUserId', () => {
    it('should find and return a job preference by job seeker id', async () => {
      const userId = '1';
      const role = UserRoleEnum.JOBSEEKER;
      const jobPreference = new JobPreference({
        jobPreferenceId: 1,
        benefitPreference: 3,
        salaryPreference: 3,
        workLifeBalancePreference: 4,
      });
      const jobSeeker = new JobSeeker({ userId: userId, role, jobPreference });

      jest
        .spyOn(jobSeekerRepository, 'findOne')
        .mockResolvedValueOnce(jobSeeker);

      const result = await jobPreferenceService.findPreferenceByUserId(
        userId,
        role,
      );

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Job preference is found',
        data: jobPreference,
      });
    });

    it('should find and return a job preference by corporate id', async () => {
      const userId = '1';
      const role = UserRoleEnum.CORPORATE;
      const jobPreference = new JobPreference({
        jobPreferenceId: 1,
        benefitPreference: 3,
        salaryPreference: 3,
        workLifeBalancePreference: 4,
      });
      const corporate = new Corporate({ userId: userId, role, jobPreference });

      jest
        .spyOn(corporateRepository, 'findOne')
        .mockResolvedValueOnce(corporate);

      const result = await jobPreferenceService.findPreferenceByUserId(
        userId,
        role,
      );

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Job preference is found',
        data: jobPreference,
      });
    });

    it('should throw an error if job seeker with given id is not found', async () => {
      const userId = '1';
      const role = UserRoleEnum.JOBSEEKER;

      jest.spyOn(jobSeekerRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(
        jobPreferenceService.findPreferenceByUserId(userId, role),
      ).rejects.toThrow('Job Seeker Id provided is not valid');
    });

    it('should throw an error if corporate with given id is not found', async () => {
      const userId = '1';
      const role = UserRoleEnum.CORPORATE;

      jest.spyOn(corporateRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(
        jobPreferenceService.findPreferenceByUserId(userId, role),
      ).rejects.toThrow('Corporate Id provided is not valid');
    });

    it('should throw an error if job seeker has no job preference', async () => {
      const userId = '1';
      const role = UserRoleEnum.JOBSEEKER;
      const jobSeeker = new JobSeeker({ userId: userId, role });

      jest
        .spyOn(jobSeekerRepository, 'findOne')
        .mockResolvedValueOnce(jobSeeker);

      await expect(
        jobPreferenceService.findPreferenceByUserId(userId, role),
      ).rejects.toThrow('Job Seeker has no existing job preference');
    });

    it('should throw an error if corporate has no job preference', async () => {
      const userId = '1';
      const role = UserRoleEnum.CORPORATE;
      const corporate = new Corporate({ userId: userId, role });

      jest
        .spyOn(corporateRepository, 'findOne')
        .mockResolvedValueOnce(corporate);

      await expect(
        jobPreferenceService.findPreferenceByUserId(userId, role),
      ).rejects.toThrow('Corporate has no existing job preference');
    });
  });

  describe('update', () => {
    it('should update a job preference and return the updated job preference', async () => {
      const id = 1;
      const updateJobPreferenceDto: UpdateJobPreferenceDto = {
        jobSeekerId: '1',
        corporateId: '',
        benefitPreference: 4,
        salaryPreference: 3,
        workLifeBalancePreference: 3,
      };

      const jobPreference = new JobPreference({
        benefitPreference: 4,
        salaryPreference: 3,
        workLifeBalancePreference: 3,
      });

      jest
        .spyOn(jobPreferenceService, 'findOne')
        .mockResolvedValueOnce(jobPreference);
      jest
        .spyOn(jobPreferenceRepository, 'save')
        .mockResolvedValueOnce(jobPreference);

      const result = await jobPreferenceService.update(
        id,
        updateJobPreferenceDto,
      );

      expect(result).toEqual({
        statusCode: 200,
        message: 'Job preference updated',
        data: jobPreference,
      });
    });

    it('should throw an error if job preference id is not valid', async () => {
      const id = 1;
      const updateJobPreferenceDto: UpdateJobPreferenceDto = {
        jobSeekerId: '1',
        corporateId: '',
        benefitPreference: 4,
        salaryPreference: 3,
        workLifeBalancePreference: 3,
      };

      jest.spyOn(jobPreferenceService, 'findOne').mockResolvedValueOnce(null);

      await expect(
        jobPreferenceService.update(id, updateJobPreferenceDto),
      ).rejects.toThrow('Job Preference Id provided is not valid');
    });

    it('should throw an error if updating fails', async () => {
      const id = 1;
      const updateJobPreferenceDto: UpdateJobPreferenceDto = {
        jobSeekerId: '1',
        corporateId: '',
        benefitPreference: 4,
        salaryPreference: 3,
        workLifeBalancePreference: 3,
      };

      const jobPreference = new JobPreference({
        benefitPreference: 4,
        salaryPreference: 3,
        workLifeBalancePreference: 3,
      });

      jest
        .spyOn(jobPreferenceService, 'findOne')
        .mockResolvedValueOnce(jobPreference);
      jest
        .spyOn(jobPreferenceRepository, 'save')
        .mockRejectedValueOnce(new Error('Failed to update job preference'));

      await expect(
        jobPreferenceService.update(id, updateJobPreferenceDto),
      ).rejects.toThrow('Failed to update job preference');
    });
  });

  describe('remove', () => {
    it('should remove a job preference and return the result', async () => {
      const id = 1;
      const result = new DeleteResult();
      result.affected = 1;
      result.raw = {};
      jest.spyOn(jobPreferenceRepository, 'delete').mockResolvedValue(result);
      const response = await jobPreferenceService.remove(id);
      expect(response).toEqual(result);
    });

    it('should throw a not found exception if job preference is not found', async () => {
      const id = 1;
      const result = new DeleteResult();
      result.affected = 0;
      result.raw = {};
      jest.spyOn(jobPreferenceRepository, 'delete').mockResolvedValue(result);
      await expect(jobPreferenceService.remove(id)).rejects.toThrow(
        new HttpException('Job Preference id not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw a bad request exception if there is a database error', async () => {
      const id = 1;
      jest
        .spyOn(jobPreferenceRepository, 'delete')
        .mockRejectedValue(new Error('Database error'));
      await expect(jobPreferenceService.remove(id)).rejects.toThrow(
        new HttpException('Database error', HttpStatus.BAD_REQUEST),
      );
    });
  });
});
