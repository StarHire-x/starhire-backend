import { Test, TestingModule } from '@nestjs/testing';
import { RecruiterService } from './recruiter.service';
import { DeleteResult, Repository } from 'typeorm';
import { JobAssignment } from '../entities/jobAssignment.entity';
import { JobApplication } from '../entities/jobApplication.entity';
import { JobListing } from '../entities/jobListing.entity';
import { JobSeeker } from '../entities/jobSeeker.entity';
import { EmailService } from '../email/email.service';
import { TwilioService } from '../twilio/twilio.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Recruiter } from '../entities/recruiter.entity';
import { CreateRecruiterDto } from './dto/create-recruiter.dto';
import UserStatusEnum from '../enums/userStatus.enum';
import { CreateCorporateDto } from '../corporate/dto/create-corporate.dto';
import { Corporate } from '../entities/corporate.entity';
import NotificationModeEnum from '../enums/notificationMode.enum';
import UserRoleEnum from '../enums/userRole.enum';
import { HttpException, HttpStatus } from '@nestjs/common';
import JobApplicationStatusEnum from '../enums/jobApplicationStatus.enum';
import { UpdateRecruiterDto } from './dto/update-recruiter.dto';

describe('RecruiterService', () => {
  let recruiterService: RecruiterService;
  let recruiterRepository: Repository<Recruiter>;
  let jobAssignmentRepository: Repository<JobAssignment>;
  let jobSeekerRepository: Repository<JobSeeker>;
  let jobListingRepository: Repository<JobListing>;
  let jobApplicationRepository: Repository<JobApplication>;
  let emailService: EmailService;
  let twilioService: TwilioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecruiterService,
        {
          provide: getRepositoryToken(JobSeeker),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Recruiter),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(JobAssignment),
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

    recruiterService = module.get<RecruiterService>(RecruiterService);
    emailService = module.get<EmailService>(EmailService);
    twilioService = module.get<TwilioService>(TwilioService);
    recruiterRepository = module.get<Repository<Recruiter>>(
      getRepositoryToken(Recruiter),
    );
    jobAssignmentRepository = module.get<Repository<JobAssignment>>(
      getRepositoryToken(JobAssignment),
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
    expect(recruiterService).toBeDefined();
    expect(recruiterRepository).toBeDefined();
    expect(jobAssignmentRepository).toBeDefined();
    expect(jobSeekerRepository).toBeDefined();
    expect(jobListingRepository).toBeDefined();
    expect(jobApplicationRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a recruiter and return the created recruiter', async () => {
      const createRecruiterDto: CreateRecruiterDto = {
        userName: 'recruiterTest',
        email: 'recruiter@gmail.com',
        password: 'securepassword',
        contactNo: '555-1234',
        status: UserStatusEnum.ACTIVE,
        notificationMode: NotificationModeEnum.EMAIL,
        createdAt: new Date(),
        role: UserRoleEnum.RECRUITER,
        fullName: 'Man Tan',
        profilePictureUrl: 'https://example.com/profile-picture.jpg',
      };

      const recruiter = new Recruiter({
        userName: 'recruiterTest',
        email: 'recruiter@gmail.com',
        password: 'securepassword',
        contactNo: '555-1234',
        status: UserStatusEnum.ACTIVE,
        notificationMode: NotificationModeEnum.EMAIL,
        createdAt: new Date(),
        role: UserRoleEnum.RECRUITER,
        fullName: 'Man Tan',
        profilePictureUrl: 'https://example.com/profile-picture.jpg',
      });

      jest.spyOn(recruiterRepository, 'save').mockResolvedValueOnce(recruiter);

      const result = await recruiterService.create(createRecruiterDto);

      expect(result).toEqual({
        statusCode: 200,
        message: 'Recruiter created',
        data: recruiter,
      });
    });

    it('should throw an error if email is missing', async () => {
      const createRecruiterDto = {
        userName: 'recruiterTest',
        // email is missing
        password: 'securepassword',
        contactNo: '555-1234',
        status: UserStatusEnum.ACTIVE,
        notificationMode: NotificationModeEnum.EMAIL,
        createdAt: new Date(),
        role: UserRoleEnum.RECRUITER,
        fullName: 'Man Tan',
        profilePictureUrl: 'https://example.com/profile-picture.jpg',
      };

      await expect(recruiterService.create(createRecruiterDto)).rejects.toThrow(
        'Failed to create recruiter',
      );
    });

    it('should throw an error if unknown ENUM values are inputted', async () => {
      const createRecruiterDto = {
        userName: 'recruiterTest',
        email: 'recruiter@gmail.com',
        password: 'securepassword',
        contactNo: '555-1234',
        status: null, // unknown status
        notificationMode: NotificationModeEnum.EMAIL,
        createdAt: new Date(),
        role: UserRoleEnum.RECRUITER,
        fullName: 'Man Tan',
        profilePictureUrl: 'https://example.com/profile-picture.jpg',
      };

      await expect(recruiterService.create(createRecruiterDto)).rejects.toThrow(
        'Failed to create recruiter',
      );
    });

    it('should throw an error if creation fails', async () => {
      const createRecruiterDto: CreateRecruiterDto = {
        userName: 'recruiterTest',
        email: 'recruiter@gmail.com',
        password: 'securepassword',
        contactNo: '555-1234',
        status: null,
        notificationMode: NotificationModeEnum.EMAIL,
        createdAt: new Date(),
        role: UserRoleEnum.RECRUITER,
        fullName: 'Man Tan',
        profilePictureUrl: 'https://example.com/profile-picture.jpg',
      };

      jest
        .spyOn(recruiterRepository, 'save')
        .mockRejectedValueOnce(new Error('Failed to create new recruiter'));

      await expect(recruiterService.create(createRecruiterDto)).rejects.toThrow(
        'Failed to create recruiter',
      );
    });
  });

  describe('findAll', () => {
    it('should return all recruiters if there are any', async () => {
      const recruiter1 = new Recruiter({
        userId: 'recruiter1',
      });
      const recruiter2 = new Recruiter({
        userId: 'recruiter2',
      });
      const recruiters = [recruiter1, recruiter2];

      jest.spyOn(recruiterRepository, 'find').mockResolvedValueOnce(recruiters);

      const result = await recruiterService.findAll();

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Recruiter found',
        data: recruiters,
      });
    });

    it('should return not found if there are no recruiters', async () => {
      jest.spyOn(recruiterRepository, 'find').mockResolvedValueOnce([]);

      const result = await recruiterService.findAll();

      expect(result).toEqual({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Recrutier not found',
        data: [],
      });
    });

    it('should throw an error if finding recruiters fails', async () => {
      jest
        .spyOn(recruiterRepository, 'find')
        .mockRejectedValueOnce(new Error('Failed to find recruiters'));

      await expect(recruiterService.findAll()).rejects.toThrow(
        'Failed to find recruiter',
      );
    });
  });

  describe('findRecruiterMatchingStatistics', () => {
    it('should return statistics and responses if recruiter exists and there are job assignments and job applications', async () => {
      const jobApplication = new JobApplication({
        jobApplicationId: 1,
        submissionDate: new Date('2023-10-11'),
      });

      const recruiter = new Recruiter({
        userId: 'recruiter1',
      });

      const jobAssignment = [
        new JobAssignment({
          jobAssignmentId: 1,
          jobSeekerId: 'test1',
          jobListingId: 1,
          recruiterId: 'recruiter1',
          assignedTime: new Date('2023-10-10'),
        }),
      ];

      const jobListing = new JobListing({
        jobListingId: 1,
        title: 'Software Engineer',
      });

      const jobSeeker = new JobSeeker({
        userId: 'test1',
        fullName: 'Test User',
        profilePictureUrl: 'test-profile.jpg',
      });

      const corporate = new Corporate({
        userId: 'testCorporate',
        companyName: 'Test User',
        profilePictureUrl: 'test-profile.jpg',
      });

      jobApplication.jobSeeker = jobSeeker;
      jobApplication.jobListing = jobListing;
      corporate.jobListings = [jobListing];

      recruiter.jobApplications = [jobApplication];

      jest.spyOn(recruiterRepository, 'findOne').mockResolvedValue(recruiter);
      jest
        .spyOn(jobAssignmentRepository, 'find')
        .mockResolvedValue(jobAssignment);
      jest.spyOn(jobSeekerRepository, 'findOne').mockResolvedValue(jobSeeker);
      jest.spyOn(jobListingRepository, 'findOne').mockResolvedValue(jobListing);

      const result =
        await recruiterService.findRecruiterMatchingStatistics('recruiter1');

      const expectedResponse = {
        statusCode: 200,
        message: 'Statistics found',
        data: {
          stats: {
            duration: '24hrs 0mins',
            matched: 1,
            acceptanceRate: '100.00',
          },
          response: [],
        },
      };

      expect(result).toEqual(expectedResponse);
    });

    it('should return 0 acceptance rate and duration if there are no job assignments', async () => {
      // Mock data
      const recruiter = new Recruiter({
        userId: 'recruiter1',
        jobApplications: [],
      });

      jest.spyOn(recruiterRepository, 'findOne').mockResolvedValue(recruiter);
      jest.spyOn(jobAssignmentRepository, 'find').mockResolvedValue([]);

      // Call method
      const result =
        await recruiterService.findRecruiterMatchingStatistics('recruiter1');

      // Expected response
      const expectedResponse = {
        statusCode: HttpStatus.OK,
        message: 'Statistics found',
        data: {
          stats: {
            duration: 'N.A',
            matched: 0,
            acceptanceRate: '0.00',
          },
          response: [],
        },
      };

      // Assertions
      expect(result).toEqual(expectedResponse);
    });

    // it('should return 0 acceptance rate and duration if there are job assignments but no job applications', async () => {
    //   
    //   const jobAssignment = [
    //     new JobAssignment({
    //       jobAssignmentId: 1,
    //       jobSeekerId: 'test1',
    //       jobListingId: 1,
    //       recruiterId: 'recruiter1',
    //       assignedTime: new Date('2023-10-10'),
    //     }),
    //   ];

    //   const corporate = new Corporate({
    //     userId: 'testCorporate',
    //     companyName: 'Test Corp',
    //     profilePictureUrl: 'test-profile.jpg',
    //   });

    //   const jobListing = new JobListing({
    //     jobListingId: 1,
    //     title: 'Software Engineer',
    //     // Assuming the corporate property is populated via a relation
    //     corporate: corporate,
    //   });

    //   const recruiter = new Recruiter({
    //     userId: 'recruiter1',
    //     jobApplications: [],
    //   });

    //   
    //   jest.spyOn(recruiterRepository, 'findOne').mockResolvedValue(recruiter);
    //   jest
    //     .spyOn(jobAssignmentRepository, 'find')
    //     .mockResolvedValue(jobAssignment);
    //   jest.spyOn(jobSeekerRepository, 'findOne').mockResolvedValue(jobS); // If no job seeker is found
    //   jest.spyOn(jobListingRepository, 'findOne').mockResolvedValue(jobListing);

    //   
    //   const result =
    //     await recruiterService.findRecruiterMatchingStatistics('recruiter1');

    //   
    //   const expectedResponse = {
    //     statusCode: HttpStatus.OK,
    //     message: 'Statistics found',
    //     data: {
    //       stats: {
    //         duration: 'N.A',
    //         matched: 1,
    //         acceptanceRate: '0.00',
    //       },
    //       response: [],
    //     },
    //   };

    //   
    //   expect(result).toEqual(expectedResponse);
    // });

    it('should throw a bad request exception if an error occurs', async () => {
      const userId = '1234';

      jest
        .spyOn(recruiterRepository, 'findOne')
        .mockRejectedValue(new Error('Failed to find recruiter'));

      await expect(
        recruiterService.findRecruiterMatchingStatistics(userId),
      ).rejects.toThrow(
        new HttpException('Failed to find recruiter', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('findByEmail', () => {
    it('should return recruiter if email exists', async () => {
      const email = 'test@example.com';
      const recruiter = new Recruiter({ email });
      jest.spyOn(recruiterRepository, 'findOne').mockResolvedValue(recruiter);

      const result = await recruiterService.findByEmail(email);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Recruiter found',
        data: recruiter,
      });
    });

    it('should return not found if email does not exist', async () => {
      const email = 'test@example.com';
      jest.spyOn(recruiterRepository, 'findOne').mockResolvedValue(null);

      const result = await recruiterService.findByEmail(email);

      expect(result).toEqual({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Recrutier not found',
      });
    });

    it('should throw error if findOne fails', async () => {
      const email = 'test@example.com';
      jest
        .spyOn(recruiterRepository, 'findOne')
        .mockRejectedValue(new Error('Failed to find recruiter'));

      await expect(recruiterService.findByEmail(email)).rejects.toThrow(
        new HttpException('Failed to find recruiter', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('findByUserId', () => {
    it('should return recruiter if userId exists', async () => {
      const userId = '1234';
      const recruiter = new Recruiter({ userId });
      jest.spyOn(recruiterRepository, 'findOne').mockResolvedValue(recruiter);

      const result = await recruiterService.findByUserId(userId);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Recruiter found',
        data: recruiter,
      });
    });

    it('should return not found if userId does not exist', async () => {
      const userId = '1234';
      jest.spyOn(recruiterRepository, 'findOne').mockResolvedValue(null);

      const result = await recruiterService.findByUserId(userId);

      expect(result).toEqual({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Recrutier not found',
      });
    });

    it('should throw error if findOne fails', async () => {
      const userId = '1234';
      jest
        .spyOn(recruiterRepository, 'findOne')
        .mockRejectedValue(new Error('Failed to find recruiter'));

      await expect(recruiterService.findByUserId(userId)).rejects.toThrow(
        new HttpException('Failed to find recruiter', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('findOne', () => {
    it('should return recruiter if id exists', async () => {
      const id = '1234';
      const recruiter = new Recruiter({ userId: id });
      jest.spyOn(recruiterRepository, 'findOne').mockResolvedValue(recruiter);

      const result = await recruiterService.findOne(id);

      expect(result).toEqual(recruiter);
    });

    it('should throw error if findOne fails', async () => {
      const id = '1234';
      jest
        .spyOn(recruiterRepository, 'findOne')
        .mockRejectedValue(new Error('Failed to find recruiter'));

      await expect(recruiterService.findOne(id)).rejects.toThrow(
        new HttpException('Failed to find recruiter', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('getJobApplicationsForRecruiter', () => {
    it('should return job applications for recruiter with status count and formatted response', async () => {
      const recruiterId = '1234';
      const recruiter = new Recruiter({
        userId: recruiterId,
        jobApplications: [
          new JobApplication({
            jobApplicationId: 1,
            jobApplicationStatus: JobApplicationStatusEnum.SUBMITTED,
          }),
        ],
      });
      const jobApplicationRef = new JobApplication({
        jobApplicationId: 1,
        jobApplicationStatus: JobApplicationStatusEnum.SUBMITTED,
      });
      const jobSeeker = new JobSeeker({
        userId: '5678',
        fullName: 'Test User',
        profilePictureUrl: 'profile.jpg',
      });
      const corporate = new Corporate({
        userId: '91011',
        companyName: 'Test Company',
        profilePictureUrl: 'corporate.jpg',
      });
      const jobListing = new JobListing({
        jobListingId: 2,
        title: 'Software Engineer',
        corporate,
      });

      jest.spyOn(recruiterRepository, 'findOne').mockResolvedValue(recruiter);
      jest
        .spyOn(jobApplicationRepository, 'findOne')
        .mockResolvedValue({ ...jobApplicationRef, jobSeeker, jobListing });
      jest.spyOn(jobListingRepository, 'findOne').mockResolvedValue(jobListing);

      const result =
        await recruiterService.getJobApplicationsForRecruiter(recruiterId);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Statistics found',
        data: {
          statusCount: {
            Total: 1,
            Submitted: 1,
            Processing: 0,
            To_Be_Submitted: 0,
            Waiting_For_Interview: 0,
            Offer_Rejected: 0,
            Offer_Accepted: 0,
            Rejected: 0,
            Offered: 0,
          },
          formatResponse: [
            {
              jobApplicationId: 1,
              jobApplicationStatus: 'Submitted',
              jobSeekerId: '5678',
              jobSeekerName: 'Test User',
              jobSeekerProfilePic: 'profile.jpg',
              corporateId: '91011',
              corporateName: 'Test Company',
              corporateProfilePic: 'corporate.jpg',
              jobListingId: 2,
              jobListingTitle: 'Software Engineer',
            },
          ],
        },
      });
    });

    it('should throw not found exception if recruiter id does not exist', async () => {
      const recruiterId = '1234';

      jest.spyOn(recruiterRepository, 'findOne').mockResolvedValue(null);

      await expect(
        recruiterService.getJobApplicationsForRecruiter(recruiterId),
      ).rejects.toThrow(
        new HttpException('Recruiter Id not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw bad request exception if an error occurs', async () => {
      const recruiterId = '1234';

      jest
        .spyOn(recruiterRepository, 'findOne')
        .mockRejectedValue(new Error('Failed to find recruiter'));

      await expect(
        recruiterService.getJobApplicationsForRecruiter(recruiterId),
      ).rejects.toThrow(
        new HttpException('Failed to find recruiter', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('update', () => {
    it('should update recruiter and return updated recruiter', async () => {
      const id = '1234';
      const updatedRecruiter = new UpdateRecruiterDto({
        notificationMode: 'EMAIL',
      });
      const recruiter = new Recruiter({
        userId: id,
        notificationMode: NotificationModeEnum.EMAIL,
      });

      jest.spyOn(recruiterRepository, 'findOneBy').mockResolvedValue(recruiter);
      jest
        .spyOn(recruiterRepository, 'save')
        .mockResolvedValue(recruiter);

      const result = await recruiterService.update(id, updatedRecruiter);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Recruiter updated',
        data: recruiter,
      });
    });

    it('should return not found if recruiter id does not exist', async () => {
      const id = '1234';
      const updatedRecruiter = new UpdateRecruiterDto({
        notificationMode: 'EMAIL',
      });

      jest.spyOn(recruiterRepository, 'findOneBy').mockResolvedValue(null);

      const result = await recruiterService.update(id, updatedRecruiter);

      expect(result).toEqual({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Recruiter id not found',
        data: [],
      });
    });

    it('should throw bad request exception if an error occurs', async () => {
      const id = '1234';
      const updatedRecruiter = new UpdateRecruiterDto({
        notificationMode: 'EMAIL',
      });

      jest
        .spyOn(recruiterRepository, 'findOneBy')
        .mockRejectedValue(new Error('Failed to find recruiter'));

      await expect(
        recruiterService.update(id, updatedRecruiter),
      ).rejects.toThrow(
        new HttpException('Failed to update recruiter', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('remove', () => {
    it('should remove a recruiter and return the result', async () => {
      const id = 'someUserId';
      const result = new DeleteResult();
      result.affected = 1;
      result.raw = {};
      jest.spyOn(recruiterRepository, 'delete').mockResolvedValue(result);
      const response = await recruiterService.remove(id);
      expect(response).toEqual(result);
    });

    it('should throw a not found exception if recruiter is not found', async () => {
      const id = 'someUserId';
      const result = new DeleteResult();
      result.affected = 0;
      result.raw = {};
      jest.spyOn(recruiterRepository, 'delete').mockResolvedValue(result);
      await expect(recruiterService.remove(id)).rejects.toThrow(
        new HttpException('Recruiter id not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw a bad request exception if there is a database error', async () => {
      const id = 'someUserId';
      jest
        .spyOn(recruiterRepository, 'delete')
        .mockRejectedValue(new Error('Database error'));
      await expect(recruiterService.remove(id)).rejects.toThrow(
        new HttpException('Database error', HttpStatus.BAD_REQUEST),
      );
    });
  });
});
