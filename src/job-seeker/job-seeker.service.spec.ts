import { Test, TestingModule } from '@nestjs/testing';
import { JobSeekerService } from './job-seeker.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JobSeeker } from '../entities/jobSeeker.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateJobSeekerDto } from './dto/create-job-seeker.dto';
import { EmailService } from '../email/email.service';
import { TwilioService } from '../twilio/twilio.service';
import VisibilityEnum from '../enums/visibility.enum';
import HighestEducationStatusEnum from '../enums/highestEducationStatus.enum';
import UserRoleEnum from '../enums/userRole.enum';
import NotificationModeEnum from '../enums/notificationMode.enum';
import UserStatusEnum from '../enums/userStatus.enum';
import { Corporate } from '../entities/corporate.entity';
import { JobListing } from '../entities/jobListing.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import JobListingStatusEnum from '../enums/jobListingStatus.enum';
import { JobPreference } from '../entities/jobPreference.entity';
import { UpdateJobSeekerDto } from './dto/update-job-seeker.dto';

describe('JobSeekerService', () => {
  let jobSeekerService: JobSeekerService;
  let jobSeekerRepository: Repository<JobSeeker>;
  let corporateRepository: Repository<Corporate>;
  let jobListingRepository: Repository<JobListing>;
  let emailService: EmailService;
  let twilioService: TwilioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobSeekerService,
        {
          provide: getRepositoryToken(JobSeeker),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Corporate),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(JobListing),
          useClass: Repository,
        },
        {
          provide: EmailService,
          useClass: jest.fn(() => ({})),
        },
        {
          provide: TwilioService,
          useClass: jest.fn(() => ({})),
        },
      ],
    }).compile();

    jobSeekerService = module.get<JobSeekerService>(JobSeekerService);
    jobSeekerRepository = module.get<Repository<JobSeeker>>(
      getRepositoryToken(JobSeeker),
    );
    jobListingRepository = module.get<Repository<JobListing>>(
      getRepositoryToken(JobListing),
    );
    corporateRepository = module.get<Repository<Corporate>>(
      getRepositoryToken(Corporate),
    );
    emailService = module.get<EmailService>(EmailService);
    twilioService = module.get<TwilioService>(TwilioService);
  });

  it('should be defined', () => {
    expect(jobSeekerService).toBeDefined();
    expect(jobSeekerRepository).toBeDefined();
    expect(emailService).toBeDefined();
    expect(twilioService).toBeDefined();
  });

  describe('create', () => {
    it('should create a job seeker and return the created job seeker', async () => {
      const createJobSeekerDto: CreateJobSeekerDto = {
        userName: 'johndoe',
        email: 'johndoe@example.com',
        password: 'securepassword',
        contactNo: '555-1234',
        status: UserStatusEnum.ACTIVE,
        notificationMode: NotificationModeEnum.EMAIL,
        createdAt: new Date(),
        role: UserRoleEnum.JOBSEEKER,
        resumePdf: 'sample-resume.pdf',
        fullName: 'John Doe',
        dateOfBirth: new Date(),
        highestEducationStatus: HighestEducationStatusEnum.BACHELOR,
        profilePictureUrl: 'https://example.com/profile-picture.jpg',
        homeAddress: '123 Main St, Anytown, USA',
        instituteName: 'University of Example',
        dateOfGraduation: new Date(),
        visibility: VisibilityEnum.PUBLIC,
      };

      const jobSeeker = new JobSeeker({
        userId: 'testingJohn',
        userName: 'johndoe',
        email: 'johndoe@example.com',
        password: 'securepassword',
        contactNo: '555-1234',
        status: UserStatusEnum.ACTIVE,
        notificationMode: NotificationModeEnum.EMAIL,
        createdAt: new Date(),
        role: UserRoleEnum.JOBSEEKER,
        resumePdf: 'sample-resume.pdf',
        fullName: 'John Doe',
        dateOfBirth: new Date(),
        highestEducationStatus: HighestEducationStatusEnum.BACHELOR,
        profilePictureUrl: 'https://example.com/profile-picture.jpg',
        homeAddress: '123 Main St, Anytown, USA',
        instituteName: 'University of Example',
        dateOfGraduation: new Date(),
        visibility: VisibilityEnum.PUBLIC,
      });

      jest.spyOn(jobSeekerRepository, 'save').mockResolvedValueOnce(jobSeeker);

      const result = await jobSeekerService.create(createJobSeekerDto);

      expect(result).toEqual({
        statusCode: 200,
        message: 'Job seeker created successfully.',
        data: createJobSeekerDto,
      });
    });

    it('should throw an error if creation fails', async () => {
      const createJobSeekerDto: CreateJobSeekerDto = {
        userName: 'johndoe',
        email: 'johndoe@example.com',
        password: 'securepassword',
        contactNo: '555-1234',
        status: UserStatusEnum.ACTIVE,
        notificationMode: NotificationModeEnum.EMAIL,
        createdAt: new Date(),
        role: UserRoleEnum.JOBSEEKER,
        resumePdf: 'sample-resume.pdf',
        fullName: 'John Doe',
        dateOfBirth: new Date(),
        highestEducationStatus: HighestEducationStatusEnum.BACHELOR,
        profilePictureUrl: 'https://example.com/profile-picture.jpg',
        homeAddress: '123 Main St, Anytown, USA',
        instituteName: 'University of Example',
        dateOfGraduation: new Date(),
        visibility: VisibilityEnum.PUBLIC,
      };

      jest
        .spyOn(jobSeekerRepository, 'save')
        .mockRejectedValueOnce(new Error('Failed to create job seeker'));

      await expect(jobSeekerService.create(createJobSeekerDto)).rejects.toThrow(
        'Failed to create job seeker',
      );
    });
  });

  describe('findByEmail', () => {
    it('should find a job seeker by email and return the job seeker', async () => {
      const email = 'test@example.com';

      const jobSeeker = new JobSeeker({
        userId: 'testingJohn',
        email: email,
      });

      jest
        .spyOn(jobSeekerRepository, 'findOne')
        .mockResolvedValueOnce(jobSeeker);

      const result = await jobSeekerService.findByEmail(email);

      expect(result).toEqual({
        statusCode: 200,
        message: 'Job seeker found',
        data: jobSeeker,
      });
    });

    it('should return not found if job seeker does not exist', async () => {
      const email = 'test@example.com';

      jest.spyOn(jobSeekerRepository, 'findOne').mockResolvedValueOnce(null);

      const result = await jobSeekerService.findByEmail(email);

      expect(result).toEqual({
        statusCode: 404,
        message: 'Job seeker not found',
      });
    });

    it('should throw an error if query fails', async () => {
      const email = 'test@example.com';

      jest
        .spyOn(jobSeekerRepository, 'findOne')
        .mockRejectedValueOnce(new Error('Failed to find job seeker'));

      await expect(jobSeekerService.findByEmail(email)).rejects.toThrow(
        'Failed to find job seeker',
      );
    });
  });

  describe('findByUserId', () => {
    it('should return a job seeker if found', async () => {
      const userId = 'someUserId';
      const jobSeeker = new JobSeeker({
        userId: userId,
      });
      jest.spyOn(jobSeekerRepository, 'findOne').mockResolvedValue(jobSeeker);
      const result = await jobSeekerService.findByUserId(userId);
      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Job seeker found',
        data: jobSeeker,
      });
    });

    it('should return a not found message if job seeker is not found', async () => {
      const userId = 'someUserId';
      jest.spyOn(jobSeekerRepository, 'findOne').mockResolvedValue(null);
      const result = await jobSeekerService.findByUserId(userId);
      expect(result).toEqual({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Job seeker not found',
      });
    });
  });

  describe('findOne', () => {
    it('should return a job seeker if found', async () => {
      const userId = 'someUserId';
      const jobSeeker = new JobSeeker({
        userId: userId,
      });
      jest.spyOn(jobSeekerRepository, 'findOne').mockResolvedValue(jobSeeker);
      const result = await jobSeekerService.findOne(userId);
      expect(result).toEqual(jobSeeker);
    });

    it('should throw a not found exception if job seeker is not found', async () => {
      const userId = 'someUserId';
      jest.spyOn(jobSeekerRepository, 'findOne').mockResolvedValue(null);
      await expect(jobSeekerService.findOne(userId)).rejects.toThrow(
        new HttpException('Job seeker id not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('findMyFollowings', () => {
    it('should return the number of followings if job seeker is found', async () => {
      const userId = 'someUserId';
      const jobSeeker = new JobSeeker({
        userId: userId,
        following: [],
      });
      jest.spyOn(jobSeekerRepository, 'findOne').mockResolvedValue(jobSeeker);
      const result = await jobSeekerService.findMyFollowings(userId);
      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Number of followings found',
        data: 0,
      });
    });

    it('should return a not found message if job seeker is not found', async () => {
      const userId = 'someUserId';
      jest.spyOn(jobSeekerRepository, 'findOne').mockResolvedValue(null);
      const result = await jobSeekerService.findMyFollowings(userId);
      expect(result).toEqual({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Following not found',
      });
    });
  });

  describe('update', () => {
    it('should update a job seeker and return the updated job seeker', async () => {
      const id = 'someUserId';
      const updatedJobSeekerDto: UpdateJobSeekerDto = {
        userName: 'johndoe',
        email: 'johndoe@example.com',
        password: 'securepassword',
        contactNo: '55541234',
      };

      const initialJobSeeker = new JobSeeker({
        userId: id,
        userName: 'johndoe',
        email: 'johndoe@example.com',
        password: 'securepassword',
        contactNo: '555412345',
      });

      const updatedJobSeeker = new JobSeeker({
        userId: id,
        userName: 'johndoe',
        email: 'johndoe@example.com',
        password: 'securepassword',
        contactNo: '55541234',
      });

      jest
        .spyOn(jobSeekerRepository, 'findOneBy')
        .mockResolvedValue(initialJobSeeker);
      jest
        .spyOn(jobSeekerRepository, 'save')
        .mockResolvedValue(updatedJobSeeker);
      const result = await jobSeekerService.update(id, updatedJobSeekerDto);
      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Job seeker updated',
        data: updatedJobSeeker,
      });
    });

    it('should throw a not found exception if job seeker is not found', async () => {
      const id = 'someUserId';
      const updatedJobSeekerDto: UpdateJobSeekerDto = {
        userName: 'johndoe',
        email: 'johndoe@example.com',
        password: 'securepassword',
        contactNo: '55541234',
      };
      jest.spyOn(jobSeekerRepository, 'findOneBy').mockResolvedValue(null);
      await expect(
        jobSeekerService.update(id, updatedJobSeekerDto),
      ).rejects.toThrow(
        new HttpException('Job seeker id not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('findAll', () => {
    it('should return all job seekers', async () => {
      const jobSeeker1 = new JobSeeker({
        userId: 'testingJohn',
        chats: [],
        jobPreference: undefined,
        jobListings: [],
        jobExperiences: [],
      });

      const jobSeeker2 = new JobSeeker({
        userId: 'testingJohn1',
        chats: [],
        jobPreference: undefined,
        jobListings: [],
        jobExperiences: [],
      });

      const jobSeekers = [jobSeeker1, jobSeeker2];
      jest.spyOn(jobSeekerRepository, 'find').mockResolvedValue(jobSeekers);
      const result = await jobSeekerService.findAll();
      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Job seeker found',
        data: jobSeekers,
      });
    });

    it('should throw a not found exception if no job seekers are found', async () => {
      jest
        .spyOn(jobSeekerRepository, 'find')
        .mockRejectedValue(
          new HttpException('Job seeker not found', HttpStatus.NOT_FOUND),
        );
      await expect(jobSeekerService.findAll()).rejects.toThrow(
        new HttpException('Job seeker not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('findAllWithSimilarity', () => {
    it('should return all job seekers with similarity scores', async () => {
      // Mock data setup
      const jobListingId = 1;

      const jobPreference1 = new JobPreference({
        jobPreferenceId: 1,
        benefitPreference: 3,
        salaryPreference: 4,
        workLifeBalancePreference: 3,
      });

      const jobPreference2 = new JobPreference({
        jobPreferenceId: 2,
        benefitPreference: 1,
        salaryPreference: 4,
        workLifeBalancePreference: 5,
      });

      const jobPreference3 = new JobPreference({
        jobPreferenceId: 3,
        benefitPreference: 4,
        salaryPreference: 4,
        workLifeBalancePreference: 2,
      });

      const corporate = new Corporate({
        userId: 'corporate1',
        jobPreference: jobPreference3,
      });

      const jobListing = new JobListing({
        jobListingId: 1,
        corporate: corporate,
      });

      const jobSeeker1 = new JobSeeker({
        userId: '1',
        userName: 'johndoe',
        jobPreference: jobPreference1,
        jobListings: [jobListing],
      });

      const jobSeeker2 = new JobSeeker({
        userId: '2',
        userName: 'johndoe2',
        jobPreference: jobPreference2,
        jobListings: [jobListing],
      });

      const jobSeekers = [jobSeeker1, jobSeeker2];

      const similarJobSeekers = [
        {
          userId: '1',
          userName: 'johndoe',
          jobPreference: {
            jobPreferenceId: 1,
            benefitPreference: 3,
            salaryPreference: 4,
            workLifeBalancePreference: 3,
          },
          jobListings: [
            {
              jobListingId: 1,
              corporate: corporate,
            },
          ],
          similarity: 98.59,
          corporatePreference: {
            benefitPreference: 4,
            jobPreferenceId: 3,
            salaryPreference: 4,
            workLifeBalancePreference: 2,
          },
        },
        {
          userId: '2',
          userName: 'johndoe2',
          jobPreference: {
            jobPreferenceId: 2,
            benefitPreference: 1,
            salaryPreference: 4,
            workLifeBalancePreference: 5,
          },
          jobListings: [
            {
              jobListingId: 1,
              corporate: corporate,
            },
          ],
          similarity: 88.58,
          corporatePreference: {
            benefitPreference: 4,
            jobPreferenceId: 3,
            salaryPreference: 4,
            workLifeBalancePreference: 2,
          },
        },
      ];

      jest.spyOn(jobSeekerRepository, 'find').mockResolvedValue(jobSeekers);
      jest.spyOn(jobListingRepository, 'findOne').mockResolvedValue(jobListing);
      jest.spyOn(corporateRepository, 'findOne').mockResolvedValue(corporate);

      const result = await jobSeekerService.findAllWithSimilarity(jobListingId);
      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Job seeker found',
        data: similarJobSeekers,
      });
    });

    it('should throw a not found exception if no job seekers are found', async () => {
      const jobListingId = 1;
      jest.spyOn(jobSeekerRepository, 'find').mockResolvedValue([]);
      await expect(
        jobSeekerService.findAllWithSimilarity(jobListingId),
      ).rejects.toThrow(
        new HttpException('Failed to find job seeker', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw a not found exception if the job listing is not found', async () => {
      const jobListingId = 1;
      const jobSeekers = [
        {
          userId: '1',
          userName: 'johndoe',
          email: 'johndoe@example.com',
          password: 'securepassword',
          contactNo: '555-1234',
          status: UserStatusEnum.ACTIVE,
          notificationMode: NotificationModeEnum.EMAIL,
          createdAt: new Date(),
          role: UserRoleEnum.JOBSEEKER,
          resumePdf: 'sample-resume.pdf',
          fullName: 'John Doe',
          dateOfBirth: new Date(),
          highestEducationStatus: HighestEducationStatusEnum.BACHELOR,
          profilePictureUrl: 'https://example.com/profile-picture.jpg',
          homeAddress: '123 Main St, Anytown, USA',
          instituteName: 'University of Example',
          dateOfGraduation: new Date(),
          visibility: VisibilityEnum.PUBLIC,
          country: '',
          description: '',
          proficientLanguages: '',
          experience: '',
          certifications: '',
          recentRole: '',
          resume: '',
          startDate: undefined,
          preferredRegions: '',
          preferredJobType: '',
          preferredSchedule: '',
          payRange: '',
          visaRequirements: '',
          ranking: '',
          otherInfo: '',
          forumComments: [],
          jobApplications: [],
          eventRegistrations: [],
          forumPosts: [],
          chats: [],
          jobPreference: undefined,
          jobExperiences: [],
          tickets: [],
          reviews: [],
          jobListings: [],
          savedJobListings: [],
          following: [],
        },
        {
          userId: '2',
          userName: 'johndoe1',
          email: 'johndoe1@example.com',
          password: 'securepassword',
          contactNo: '555-1233',
          status: UserStatusEnum.ACTIVE,
          notificationMode: NotificationModeEnum.EMAIL,
          createdAt: new Date(),
          role: UserRoleEnum.JOBSEEKER,
          resumePdf: 'sample-resume.pdf',
          fullName: 'John Doea',
          dateOfBirth: new Date(),
          highestEducationStatus: HighestEducationStatusEnum.BACHELOR,
          profilePictureUrl: 'https://example.com/profile-picture.jpg',
          homeAddress: '123 Main St, Anytown, USA',
          instituteName: 'University of Example',
          dateOfGraduation: new Date(),
          visibility: VisibilityEnum.PUBLIC,
          country: '',
          description: '',
          proficientLanguages: '',
          experience: '',
          certifications: '',
          recentRole: '',
          resume: '',
          startDate: undefined,
          preferredRegions: '',
          preferredJobType: '',
          preferredSchedule: '',
          payRange: '',
          visaRequirements: '',
          ranking: '',
          otherInfo: '',
          forumComments: [],
          jobApplications: [],
          eventRegistrations: [],
          forumPosts: [],
          chats: [],
          jobPreference: undefined,
          jobExperiences: [],
          tickets: [],
          reviews: [],
          jobListings: [],
          savedJobListings: [],
          following: [],
        },
      ];
      jest.spyOn(jobSeekerRepository, 'find').mockResolvedValue(jobSeekers);
      jest.spyOn(jobListingRepository, 'findOne').mockResolvedValue(null);
      await expect(
        jobSeekerService.findAllWithSimilarity(jobListingId),
      ).rejects.toThrow(
        new HttpException('Failed to find job listing', HttpStatus.NOT_FOUND),
      );
    });
  });

  //   describe('calculateSimilarity', () => {
  //   it('should calculate similarity correctly', async () => {
  //     const jobSeekers = [
  //       {
  //         jobPreference: {
  //           benefitPreference: 1,
  //           workLifeBalancePreference: 1,
  //           salaryPreference: 1,
  //         },
  //       },
  //     ];

  //     const corporate = new Corporate({
  //       userName: 'corporate1',
  //       email: 'corporate1@example.com',
  //       password: 'examplePassword',
  //     });

  //     corporate.jobPreference = new JobPreference({
  //       jobPreferenceId: 2,
  //       benefitPreference: 1,
  //       workLifeBalancePreference: 1,
  //       salaryPreference: 1,
  //     });

  //     const results = await jobSeekerService.calculateSimilarity(jobSeekers, corporate);

  //     expect(results[0].similarity).toBe(100);
  //     expect(results[0].corporatePreference).toEqual(corporate.jobPreference);
  //   });

  //   it('should handle zero magnitude', async () => {
  //     const jobSeekers = [
  //       {
  //         jobPreference: {
  //           benefitPreference: 0,
  //           workLifeBalancePreference: 0,
  //           salaryPreference: 0,
  //         },
  //       },
  //     ];

  //     const corporate = new Corporate({
  //       userName: 'corporate1',
  //       email: 'corporate1@example.com',
  //       password: 'examplePassword',
  //     });

  //     corporate.jobPreference = new JobPreference({
  //       jobPreferenceId: 2,
  //       benefitPreference: 1,
  //       workLifeBalancePreference: 1,
  //       salaryPreference: 1,
  //     });

  //     const results = await jobSeekerService.calculateSimilarity(
  //       jobSeekers,
  //       corporate,
  //     );

  //     expect(results[0].similarity).toBe(0);
  //     expect(results[0].corporatePreference).toEqual(corporate.jobPreference);
  //   });
  // });

  describe('remove', () => {
    it('should remove a job seeker and return the result', async () => {
      const id = 'someUserId';
      const result = new DeleteResult();
      result.affected = 1;
      result.raw = {};
      jest.spyOn(jobSeekerRepository, 'delete').mockResolvedValue(result);
      const response = await jobSeekerService.remove(id);
      expect(response).toEqual(result);
    });

    it('should throw a not found exception if job seeker is not found', async () => {
      const id = 'someUserId';
      const result = new DeleteResult();
      result.affected = 0;
      result.raw = {};
      jest.spyOn(jobSeekerRepository, 'delete').mockResolvedValue(result);
      await expect(jobSeekerService.remove(id)).rejects.toThrow(
        new HttpException('Job seeker id not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw a bad request exception if there is a database error', async () => {
      const id = 'someUserId';
      jest
        .spyOn(jobSeekerRepository, 'delete')
        .mockRejectedValue(new Error('Database error'));
      await expect(jobSeekerService.remove(id)).rejects.toThrow(
        new HttpException('Database error', HttpStatus.BAD_REQUEST),
      );
    });
  });
});
