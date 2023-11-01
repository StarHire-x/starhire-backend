import { Test, TestingModule } from '@nestjs/testing';
import { CorporateService } from './corporate.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { JobApplication } from '../entities/jobApplication.entity';
import { JobSeeker } from '../entities/jobSeeker.entity';
import { EmailService } from '../email/email.service';
import { Corporate } from '../entities/corporate.entity';
import { JobListing } from '../entities/jobListing.entity';
import { TwilioService } from '../twilio/twilio.service';
import { CreateCorporateDto } from './dto/create-corporate.dto';
import UserStatusEnum from '../enums/userStatus.enum';
import NotificationModeEnum from '../enums/notificationMode.enum';
import UserRoleEnum from '../enums/userRole.enum';
import CorporatePromotionStatusEnum from '../enums/corporatePromotionStatus.enum';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import JobListingStatusEnum from '../enums/jobListingStatus.enum';
import HighestEducationStatusEnum from '../enums/highestEducationStatus.enum';
import VisibilityEnum from '../enums/visibility.enum';
import CommissionStatusEnum from '../enums/commissionStatus.enum';
import JobApplicationStatusEnum from '../enums/jobApplicationStatus.enum';
import InvoiceStatusEnum from '../enums/invoiceStatus.enum';
import { Recruiter } from '../entities/recruiter.entity';

describe('CorporateService', () => {
  let corporateService: CorporateService;
  let jobSeekerRepository: Repository<JobSeeker>;
  let corporateRepository: Repository<Corporate>;
  let jobListingRepository: Repository<JobListing>;
  let jobApplicationRepository: Repository<JobApplication>;
  let emailService: EmailService;
  let twilioService: TwilioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CorporateService,
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
          provide: getRepositoryToken(JobApplication),
          useClass: Repository,
        },
        {
          provide: EmailService,
          useClass: jest.fn(() => ({
            sendNotificationStatusEmail: jest.fn().mockResolvedValue({
              statusCode: HttpStatus.OK,
              message: 'Notification status email sent successfully',
              data: [],
            }),
          })),
        },
        {
          provide: TwilioService,
          useClass: jest.fn(() => ({
            sendNotificationStatusSMS: jest.fn().mockResolvedValue({
              statusCode: HttpStatus.OK,
              message: 'SMS successfully sent',
              data: [],
            }),
          })),
        },
      ],
    }).compile();

    corporateService = module.get<CorporateService>(CorporateService);
    emailService = module.get<EmailService>(EmailService);
    twilioService = module.get<TwilioService>(TwilioService);
    corporateRepository = module.get<Repository<Corporate>>(
      getRepositoryToken(Corporate),
    );
    jobSeekerRepository = module.get<Repository<JobSeeker>>(
      getRepositoryToken(JobSeeker),
    );
    jobListingRepository = module.get<Repository<JobListing>>(
      getRepositoryToken(JobListing),
    );
    jobApplicationRepository = module.get<Repository<JobApplication>>(
      getRepositoryToken(JobApplication),
    );
  });

  it('should be defined', () => {
    expect(corporateService).toBeDefined();
    expect(corporateRepository).toBeDefined();
    expect(jobSeekerRepository).toBeDefined();
    expect(jobListingRepository).toBeDefined();
    expect(jobApplicationRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a corporate and return the created corporate', async () => {
      const createCorporateDto: CreateCorporateDto = {
        userName: 'corporateTest',
        email: 'corporateTest@gmail.com',
        password: 'securepassword',
        contactNo: '555-1234',
        status: UserStatusEnum.ACTIVE,
        notificationMode: NotificationModeEnum.EMAIL,
        createdAt: new Date(),
        role: UserRoleEnum.CORPORATE,
        companyName: 'corporateTest Pte Ltd',
        companyRegistrationId: 1234567890,
        profilePictureUrl: 'https://example.com/profile-picture.jpg',
        companyAddress: '123 Main St, Anytown, USA',
      };

      const corporate = new Corporate({
        userId: 'corporateTest',
        userName: 'corporateTest',
        email: 'corporateTest@gmail.com',
        password: 'securepassword',
        contactNo: '555-1234',
        status: UserStatusEnum.ACTIVE,
        notificationMode: NotificationModeEnum.EMAIL,
        createdAt: new Date(),
        role: UserRoleEnum.CORPORATE,
      });

      corporate.companyName = 'corporateTest Pte Ltd';
      corporate.companyRegistrationId = 1234567890;
      corporate.profilePictureUrl = 'https://example.com/profile-picture.jpg';
      corporate.companyAddress = '123 Main St, Anytown, USA';

      jest.spyOn(corporateRepository, 'save').mockResolvedValueOnce(corporate);

      const result = await corporateService.create(createCorporateDto);

      expect(result).toEqual({
        statusCode: 200,
        message: 'Corporate created',
        data: createCorporateDto,
      });
    });

    it('should throw an error if creation fails', async () => {
      const createCorporateDto: CreateCorporateDto = {
        userName: 'corporateTest',
        email: 'corporateTest@gmail.com',
        password: 'securepassword',
        contactNo: '555-1234',
        status: UserStatusEnum.ACTIVE,
        notificationMode: NotificationModeEnum.EMAIL,
        createdAt: new Date(),
        role: UserRoleEnum.CORPORATE,
        companyName: 'corporateTest Pte Ltd',
        companyRegistrationId: 1234567890,
        profilePictureUrl: 'https://example.com/profile-picture.jpg',
        companyAddress: '123 Main St, Anytown, USA',
      };

      jest
        .spyOn(jobSeekerRepository, 'save')
        .mockRejectedValueOnce(new Error('Failed to create new corporate'));

      await expect(corporateService.create(createCorporateDto)).rejects.toThrow(
        'Failed to create new corporate',
      );
    });
  });

  describe('findByEmail', () => {
    it('should return all job seekers', async () => {
      const corporates: Corporate[] = [
        new Corporate({
          userId: 'corporateTest',
        }),
        new Corporate({
          userId: 'corporateTest2',
        }),
      ];

      jest.spyOn(corporateRepository, 'find').mockResolvedValue(corporates);
      const result = await corporateService.findAll();
      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Corporate found',
        data: corporates,
      });
    });

    it('should throw a not found exception if no corporate are found', async () => {
      jest.spyOn(corporateRepository, 'find').mockResolvedValue([]);
      await expect(corporateService.findAll()).rejects.toThrow(
        new HttpException('Failed to find corporate', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('findAllJobStatistics', () => {
    it('should fill all job statistics', async () => {
      const jobApplication = new JobApplication({
        jobApplicationId: 1,
        jobApplicationStatus: JobApplicationStatusEnum.OFFERED,
      });

      const jobListing = new JobListing({
        jobListingId: 1,
        title: 'Software Engineer',
        jobListingStatus: JobListingStatusEnum.APPROVED,
      });

      jobListing.jobApplications = [jobApplication]

      const corporates: Corporate[] = [
        new Corporate({
          userId: 'corporateTest',
        }),
        new Corporate({
          userId: 'corporateTest2',
        }),
      ];

      corporates[0].companyName = 'corporateTest Pte Ltd';
      corporates[1].companyName = 'corporateTest2 Pte Ltd';

      corporates[0].jobListings = [jobListing];
      corporates[1].jobListings = [];

      const calculation = {
        labels: ['corporateTest Pte Ltd', 'corporateTest2 Pte Ltd'],
        values: [1,0],
      };

      jest.spyOn(corporateRepository, 'find').mockResolvedValue(corporates);
      const result = await corporateService.findAllJobStatistics();
      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Statistics retrieved',
        data: calculation,
      });
    });

    it('should throw a not found exception if no corporate are found', async () => {
      jest.spyOn(corporateRepository, 'find').mockResolvedValue([]);
      await expect(corporateService.findAllJobStatistics()).rejects.toThrow(
        new HttpException('No corporate found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('findBreakdownJobStatistics', () => {
    it('should find breakdown of job statistics', async () => {
      const jobListing = new JobListing({
        jobListingId: 1,
        title: 'Software Engineer',
        jobListingStatus: JobListingStatusEnum.APPROVED,
      });

      const jobListing2 = new JobListing({
        jobListingId: 2,
        title: 'Software Engineer',
        jobListingStatus: JobListingStatusEnum.REJECTED,
      });

      const jobListing3 = new JobListing({
        jobListingId: 3,
        title: 'Software Engineer',
        jobListingStatus: JobListingStatusEnum.UNVERIFIED,
      });

      const jobListing4 = new JobListing({
        jobListingId: 4,
        title: 'Software Engineer',
        jobListingStatus: JobListingStatusEnum.ARCHIVED,
      });

      const corporates: Corporate[] = [
        new Corporate({
          userId: 'corporateTest',
        }),
        new Corporate({
          userId: 'corporateTest2',
        }),
      ];

      corporates[0].companyName = 'corporateTest Pte Ltd';
      corporates[1].companyName = 'corporateTest2 Pte Ltd';

      corporates[0].jobListings = [jobListing3, jobListing4];
      corporates[1].jobListings = [jobListing, jobListing2];

      const calculation = {
        'corporateTest Pte Ltd': {
          approved: 0,
          rejected: 0,
          unverified: 1,
          archived: 1,
        },
        'corporateTest2 Pte Ltd': {
          approved: 1,
          rejected: 1,
          unverified: 0,
          archived: 0,
        },
        total: { approved: 1, rejected: 1, unverified: 1, archived: 1 },
      };

      jest.spyOn(corporateRepository, 'find').mockResolvedValue(corporates);
      const result = await corporateService.findBreakdownJobStatistics();
      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Statistics retrieved',
        data: calculation,
      });
    });

    it('should throw a not found exception if no corporate are found', async () => {
      jest.spyOn(corporateRepository, 'find').mockResolvedValue([]);
      await expect(
        corporateService.findBreakdownJobStatistics(),
      ).rejects.toThrow(
        new HttpException('No corporate found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('findBreakdownJobStatisticsOneCorporate', () => {
    it('should find breakdown of job statistics by one corporate', async () => {
      const jobListing3 = new JobListing({
        jobListingId: 3,
        title: 'Software Engineer',
        jobListingStatus: JobListingStatusEnum.UNVERIFIED,
      });

      const jobListing4 = new JobListing({
        jobListingId: 4,
        title: 'Software Engineer',
        jobListingStatus: JobListingStatusEnum.ARCHIVED,
      });

      const corporate = new Corporate({
        userId: 'corporateTest',
      });

      corporate.companyName = 'corporateTest Pte Ltd';
      corporate.jobListings = [jobListing3, jobListing4];

      const calculation = {
        approved: 0,
        rejected: 0,
        unverified: 1,
        archived: 1,
      };

      jest.spyOn(corporateRepository, 'findOne').mockResolvedValue(corporate);
      const result =
        await corporateService.findBreakdownJobStatisticsOneCorporate(
          'corporateId',
        );
      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Statistics retrieved',
        data: calculation,
      });
    });

    it('should throw a not found exception if no corporate are found', async () => {
      const corporateId = 'testFailCorporate';
      jest.spyOn(corporateRepository, 'findOne').mockResolvedValue(null);
      await expect(
        corporateService.findBreakdownJobStatisticsOneCorporate(corporateId),
      ).rejects.toThrow(
        new HttpException('Corporate not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('findOne', () => {
    it('should find one corporate', async () => {
      const corporateId = 'corporateTest';
      const corporate = new Corporate({
        userId: 'corporateTest',
      });

      jest.spyOn(corporateRepository, 'findOne').mockResolvedValue(corporate);
      const result = await corporateService.findOne(corporateId);
      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Corporate is found',
        data: corporate,
      });
    });

    it('should throw a not found exception if no corporate are found', async () => {
      const corporateId = 'corporateTest';
      jest.spyOn(corporateRepository, 'findOne').mockResolvedValue(null);
      await expect(corporateService.findOne(corporateId)).rejects.toThrow(
        new HttpException(
          'Corporate Id provided is not valid',
          HttpStatus.NOT_FOUND,
        ),
      );
    });

    it('should throw an error when the database operation fails', async () => {
      const corporateId = 'corporateTest';
      jest
        .spyOn(corporateRepository, 'findOne')
        .mockRejectedValue(new Error('Database error'));

      await expect(corporateService.findOne(corporateId)).rejects.toThrow(
        new HttpException('Database error', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('findByEmail', () => {
    it('should find one corporate by email', async () => {
      const email = 'corporateTest@gmail.com';
      const corporate = new Corporate({
        userId: 'corporateTest',
        email: 'corporateTest@gmail.com',
      });


      jest.spyOn(corporateRepository, 'findOne').mockResolvedValue(corporate);
      const result = await corporateService.findByEmail(email);
      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Corporate found',
        data: corporate,
      });
    });

    it('should throw a not found exception if no corporate are found', async () => {
      const email = 'corporateTest@gmail.com';
      jest.spyOn(corporateRepository, 'findOne').mockResolvedValue(null);
      await expect(corporateService.findByEmail(email)).rejects.toThrow(
        new HttpException('Failed to find corporate', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('findByUserId', () => {
    it('should find a corporate by user ID', async () => {
      const userId = 'sampleUserId';
      const corporate = new Corporate({
        userId: 'sampleUserId',
      });

      jest.spyOn(corporateRepository, 'findOne').mockResolvedValue(corporate);

      const result = await corporateService.findByUserId(userId);
      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Corporate found',
        data: corporate,
      });
    });

    it('should return not found if no corporate with the provided user ID is found', async () => {
      const userId = 'sampleUserId';
      jest.spyOn(corporateRepository, 'findOne').mockResolvedValue(null);

      const result = await corporateService.findByUserId(userId);
      expect(result).toEqual({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Corporate not found',
      });
    });

    it('should throw an error when the database operation fails', async () => {
      const userId = 'sampleUserId';
      jest
        .spyOn(corporateRepository, 'findOne')
        .mockRejectedValue(new Error('Database error'));

      await expect(corporateService.findByUserId(userId)).rejects.toThrow(
        new HttpException('Failed to find corporate', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('findAllCorporatesSocial', () => {
    it('should find all corporate followers', async () => {
      const corporates: Corporate[] = [
        new Corporate({
          userId: 'corporateTest',
        }),
        new Corporate({
          userId: 'corporateTest2',
        })
      ];

      corporates[0].followers = [
        new JobSeeker({
          userId: 'testingJohn',
        }),
      ];

      jest.spyOn(corporateRepository, 'find').mockResolvedValue(corporates);
      const result = await corporateService.findAllCorporatesSocial();
      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Corporate found',
        data: corporates,
      });
    });

    it('should return a not found response if no corporates are found', async () => {
      jest.spyOn(corporateRepository, 'find').mockResolvedValue([]);
      const result = await corporateService.findAllCorporatesSocial();
      expect(result).toEqual({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Corporate not found',
      });
    });
  });

  describe('addFollower', () => {
    it('should throw an error when corporateId is invalid', async () => {
      jest.spyOn(corporateRepository, 'findOne').mockResolvedValue(null);

      await expect(
        corporateService.addFollower('invalidCorporateId', 'jobSeekerId'),
      ).rejects.toThrow(
        new NotFoundException('Corporate Id provided is not valid'),
      );
    });

    it('should throw an error when jobSeekerId is invalid', async () => {
      const corporateMock = new Corporate({
          userId: 'corporateTest',
      });

      jest
        .spyOn(corporateRepository, 'findOne')
        .mockResolvedValueOnce(corporateMock)
        .mockResolvedValue(null);

      await expect(
        corporateService.addFollower('corporateTest', 'invalidJobSeekerId'),
      ).rejects.toThrow(
        new HttpException(
          "Cannot read properties of undefined (reading 'findOne')",
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should allow job seeker to follow corporate', async () => {
      const corporateMock = new Corporate({
        userId: 'corporateTest',
      });
      corporateMock.followers = []
      const jobSeekerMock = new JobSeeker({
        userId: 'testingJohn',
      });
      jobSeekerMock.following = []

      jest
        .spyOn(corporateRepository, 'findOne')
        .mockResolvedValueOnce(corporateMock);
      jest
        .spyOn(jobSeekerRepository, 'findOne')
        .mockResolvedValue(jobSeekerMock);
      jest.spyOn(corporateRepository, 'save').mockResolvedValue(corporateMock);

      const result = await corporateService.addFollower(
        'corporateTest',
        'testingJohn',
      );

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Job seeker is following corporate',
      });
    });

    it('should throw an error when an unexpected error occurs', async () => {
      jest.spyOn(corporateRepository, 'findOne').mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      await expect(
        corporateService.addFollower('validCorporateId', 'validJobSeekerId'),
      ).rejects.toThrow(
        new HttpException('Unexpected error', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('removeFollower', () => {
    it('should throw an error when corporateId is invalid', async () => {
      jest.spyOn(corporateRepository, 'findOne').mockResolvedValue(null);

      await expect(
        corporateService.removeFollower('invalidCorporateId', 'jobSeekerId'),
      ).rejects.toThrow(
        new HttpException(
          'Corporate Id provided is not valid',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should throw an error when jobSeekerId is invalid', async () => {
      const corporateMock = new Corporate({
        userId: 'corporateTest',
      });
      corporateMock.followers = [];

      jest
        .spyOn(corporateRepository, 'findOne')
        .mockResolvedValueOnce(corporateMock)
        .mockResolvedValue(null);

      await expect(
        corporateService.removeFollower('corporateTest', 'testingFail'),
      ).rejects.toThrow(
        new HttpException(
          "Cannot read properties of undefined (reading 'findOne')",
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should allow job seeker to unfollow corporate', async () => {
      const corporateMock = new Corporate({
        userId: 'corporateTest',
      });
      
      const jobSeekerMock = new JobSeeker({
        userId: 'testingJohn',
      });

      corporateMock.followers = [jobSeekerMock];
      jobSeekerMock.following = [corporateMock];

      jest
        .spyOn(corporateRepository, 'findOne')
        .mockResolvedValueOnce(corporateMock);

      jest
        .spyOn(jobSeekerRepository, 'findOne')
        .mockResolvedValueOnce(jobSeekerMock);

      jest.spyOn(corporateRepository, 'save').mockResolvedValue(corporateMock);

      const result = await corporateService.removeFollower(
        'corporateTest',
        'testingJohn',
      );

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Job seeker has unfollowed the corporate',
      });
    });

    it('should throw an error when an unexpected error occurs', async () => {
      jest.spyOn(corporateRepository, 'findOne').mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      await expect(
        corporateService.removeFollower('validCorporateId', 'validJobSeekerId'),
      ).rejects.toThrow(
        new HttpException('Unexpected error', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('update', () => {
    it('should return not found when the corporate ID does not exist', async () => {
      jest.spyOn(corporateRepository, 'findOneBy').mockResolvedValue(null);

      const result = await corporateService.update('nonexistentId', null);
      expect(result).toEqual({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Corporate id not found',
        data: [],
      });
    });

    it('should update corporate without changing notification mode', async () => {
      const existingCorporate = new Corporate({
        userId: 'existingId',
        userName: 'corporateTest',
        email: 'corporateTest@gmail.com',
        password: 'securepassword',
        contactNo: '55551234',
      });

      const updatedCorporate = new Corporate({
        userId: 'existingId',
        userName: 'corporateTest',
        email: 'corporateTest@gmail.com',
        password: 'securepassword',
        contactNo: '555512345',
      });

      jest
        .spyOn(corporateRepository, 'findOneBy')
        .mockResolvedValue(existingCorporate);
      jest
        .spyOn(corporateRepository, 'save')
        .mockResolvedValue({ ...existingCorporate, ...updatedCorporate });

      const result = await corporateService.update(
        'existingId',
        updatedCorporate,
      );
      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Corporate updated',
        data: { ...existingCorporate, ...updatedCorporate },
      });
    });

    it('should throw an error when an unexpected error occurs', async () => {
      jest.spyOn(corporateRepository, 'findOneBy').mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      await expect(corporateService.update('existingId', null)).rejects.toThrow(
        new HttpException('Failed to update corporate', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('remove', () => {
    it('should remove a corporate and return the result', async () => {
      const id = 'someUserId';
      const result = new DeleteResult();
      result.affected = 1;
      result.raw = {};
      jest.spyOn(corporateRepository, 'delete').mockResolvedValue(result);
      const response = await corporateService.remove(id);
      expect(response).toEqual(result);
    });

    it('should throw a not found exception if corporate is not found', async () => {
      const id = 'someUserId';
      const result = new DeleteResult();
      result.affected = 0;
      result.raw = {};
      jest.spyOn(corporateRepository, 'delete').mockResolvedValue(result);
      await expect(corporateService.remove(id)).rejects.toThrow(
        new HttpException('Corporate id not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw a bad request exception if there is a database error', async () => {
      const id = 'someUserId';
      jest
        .spyOn(corporateRepository, 'delete')
        .mockRejectedValue(new Error('Database error'));
      await expect(corporateService.remove(id)).rejects.toThrow(
        new HttpException('Database error', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('getAllPromotionRequest', () => {
    it('should return corporates when found', async () => {
      const corporates: Corporate[] = [
        new Corporate({
          userId: 'corporateTest',
        }),
        new Corporate({
          userId: 'corporateTest2',
        }),
      ]
      corporates[0].corporatePromotionStatus =
        CorporatePromotionStatusEnum.REQUESTED;
      
      corporates[1].corporatePromotionStatus =
        CorporatePromotionStatusEnum.REGULAR;

      jest.spyOn(corporateRepository, 'find').mockResolvedValue(corporates);

      const result = await corporateService.getAllPromotionRequest();

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Corporate found',
        data: corporates,
      });
    });

    it('should return NOT_FOUND when no corporates are found', async () => {
      jest.spyOn(corporateRepository, 'find').mockResolvedValue([]);

      const result = await corporateService.getAllPromotionRequest();

      expect(result).toEqual({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Corporate not found',
        data: [],
      });
    });

    it('should throw an exception if there is an error during retrieval', async () => {
      jest.spyOn(corporateRepository, 'find').mockRejectedValue(new Error());

      await expect(corporateService.getAllPromotionRequest()).rejects.toThrow(
        new HttpException('Failed to find corporate', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('getJobApplicationsForCorporate', () => {
    it('should return job applications for the given corporate', async () => {
      const jobApplication = new JobApplication({
        jobApplicationId: 1,
        jobApplicationStatus: JobApplicationStatusEnum.OFFERED,
      });

      const jobSeeker = new JobSeeker({
        userId: 'jobseeker',
        fullName: 'jobseeker',
        profilePictureUrl: 'profile.jpg',
      });

      const recruiter = new Recruiter({
        userId: 'recrutier1',
        fullName: 'john',
        profilePictureUrl: 'sample.jpg',
      });

      const mockJobListing = new JobListing({
        jobListingId: 1,
        title: 'Software Engineer',
        listingDate: new Date('2023-11-15'),
      });

      const mockCorporate = new Corporate({
        userId: 'sampleCorporateId',
      });
      jobApplication.jobSeeker = jobSeeker;
      jobApplication.recruiter = recruiter;
      mockJobListing.jobApplications = [jobApplication];
      mockCorporate.jobListings = [mockJobListing];

      jest
        .spyOn(corporateRepository, 'findOne')
        .mockResolvedValue(mockCorporate);
      jest
        .spyOn(jobListingRepository, 'findOne')
        .mockResolvedValue(mockJobListing);

      const result =
        await corporateService.getJobApplicationsForCorporate(
          'sampleCorporateId',
        );

      // Expected response based on the mock data
      const expectedResponse = {
        data: {
          formatResponse: [
            {
              createdDate: new Date('2023-11-15'),
              jobApplications: [
                {
                  jobApplicationId: 1,
                  jobApplicationStatus: 'Offered',
                  jobSeekerId: 'jobseeker',
                  jobSeekerName: 'jobseeker',
                  jobSeekerProfilePic: 'profile.jpg',
                  recruiterId: 'recrutier1',
                  recruiterName: 'john',
                  recruiterProfilePic: 'sample.jpg',
                },
              ],
              jobListingId: 1,
              jobListingTitle: 'Software Engineer',
            },
          ],
        },
        message: 'Statistics found',
        statusCode: 200,
      };

      expect(result).toEqual(expectedResponse);
    });

    it('should throw NOT_FOUND exception if corporate is not found', async () => {
      const corporateId = 'sampleCorporateId';

      jest.spyOn(corporateRepository, 'findOne').mockResolvedValue(null);

      await expect(
        corporateService.getJobApplicationsForCorporate(corporateId),
      ).rejects.toThrow(
        new HttpException('Corporate is not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw BAD_REQUEST exception on other errors', async () => {
      const corporateId = 'sampleCorporateId';

      jest
        .spyOn(corporateRepository, 'findOne')
        .mockRejectedValue(new Error('Sample error'));

      await expect(
        corporateService.getJobApplicationsForCorporate(corporateId),
      ).rejects.toThrow(
        new HttpException('Sample error', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('findAllJobListingStatsByCorporate', () => {
    it('should return user statistics for given userId', async () => {
      const jobListing = new JobListing({
        jobListingId: 1,
        listingDate: new Date('2023-09-01'),
        jobListingStatus: JobListingStatusEnum.APPROVED,
      });

      const jobListing2 = new JobListing({
        jobListingId: 2,
        listingDate: new Date('2023-09-02'),
        jobListingStatus: JobListingStatusEnum.APPROVED,
      });

      const corporateMock = new Corporate({
        userId: 'corporateTest',
      })

      corporateMock.jobListings = [jobListing, jobListing2]
      jest
        .spyOn(corporateRepository, 'findOne')
        .mockResolvedValue(corporateMock);

      const result =
        await corporateService.findAllJobListingStatsByCorporate(
          'corporateTest',
        );

      // Assertions
      expect(result).toHaveProperty('statusCode', HttpStatus.OK);
      expect(result).toHaveProperty('message', 'User statistics retrieved');
      expect(result.data).toHaveProperty('month');
      expect(result.data).toHaveProperty('day');
      expect(result.data).toHaveProperty('week');
    });

    it('should throw a not found exception if no user data is found', async () => {
      jest.spyOn(corporateRepository, 'findOne').mockResolvedValue(null);

      await expect(
        corporateService.findAllJobListingStatsByCorporate('invalidUserId'),
      ).rejects.toThrow(
        new HttpException('Error in Database', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw a bad request exception on any other error', async () => {
      jest
        .spyOn(corporateRepository, 'findOne')
        .mockRejectedValue(new Error('Some error'));

      await expect(
        corporateService.findAllJobListingStatsByCorporate('testUserId'),
      ).rejects.toThrow(
        new HttpException('Error in Database', HttpStatus.BAD_REQUEST),
      );
    });
  });
});
