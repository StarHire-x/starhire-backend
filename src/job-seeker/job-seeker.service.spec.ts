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
import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import JobListingStatusEnum from '../enums/jobListingStatus.enum';

describe('JobSeekerService', () => {
  let service: JobSeekerService;
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

    service = module.get<JobSeekerService>(JobSeekerService);
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
    expect(service).toBeDefined();
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

      const jobSeeker: JobSeeker = {
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
      };

      jest.spyOn(jobSeekerRepository, 'save').mockResolvedValueOnce(jobSeeker);

      const result = await service.create(createJobSeekerDto);

      expect(result).toEqual({
        statusCode: 200,
        message: 'Job seeker created',
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

      await expect(service.create(createJobSeekerDto)).rejects.toThrow(
        'Failed to create job seeker',
      );
    });
  });

  describe('findByEmail', () => {
    it('should find a job seeker by email and return the job seeker', async () => {
      const email = 'test@example.com';

      const jobSeeker: JobSeeker = {
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
      };

      jest
        .spyOn(jobSeekerRepository, 'findOne')
        .mockResolvedValueOnce(jobSeeker);

      const result = await service.findByEmail(email);

      expect(result).toEqual({
        statusCode: 200,
        message: 'Job seeker found',
        data: jobSeeker,
      });
    });

    it('should return not found if job seeker does not exist', async () => {
      const email = 'test@example.com';

      jest.spyOn(jobSeekerRepository, 'findOne').mockResolvedValueOnce(null);

      const result = await service.findByEmail(email);

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

      await expect(service.findByEmail(email)).rejects.toThrow(
        'Failed to find job seeker',
      );
    });
  });

  describe('findByUserId', () => {
    it('should return a job seeker if found', async () => {
      const userId = 'someUserId';
      const jobSeeker = {
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
      };
      jest.spyOn(jobSeekerRepository, 'findOne').mockResolvedValue(jobSeeker);
      const result = await service.findByUserId(userId);
      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Job seeker found',
        data: jobSeeker,
      });
    });

    it('should return a not found message if job seeker is not found', async () => {
      const userId = 'someUserId';
      jest.spyOn(jobSeekerRepository, 'findOne').mockResolvedValue(null);
      const result = await service.findByUserId(userId);
      expect(result).toEqual({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Job seeker not found',
      });
    });
  });

  describe('findOne', () => {
    it('should return a job seeker if found', async () => {
      const userId = 'someUserId';
      const jobSeeker = {
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
      };
      jest.spyOn(jobSeekerRepository, 'findOne').mockResolvedValue(jobSeeker);
      const result = await service.findOne(userId);
      expect(result).toEqual(jobSeeker);
    });

    it('should throw a not found exception if job seeker is not found', async () => {
      const userId = 'someUserId';
      jest.spyOn(jobSeekerRepository, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(userId)).rejects.toThrow(
        new HttpException('Job seeker id not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('findMyFollowings', () => {
    it('should return the number of followings if job seeker is found', async () => {
      const userId = 'someUserId';
      const jobSeeker = {
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
      };
      jest.spyOn(jobSeekerRepository, 'findOne').mockResolvedValue(jobSeeker);
      const result = await service.findMyFollowings(userId);
      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Number of followings found',
        data: 0,
      });
    });

    it('should return a not found message if job seeker is not found', async () => {
      const userId = 'someUserId';
      jest.spyOn(jobSeekerRepository, 'findOne').mockResolvedValue(null);
      const result = await service.findMyFollowings(userId);
      expect(result).toEqual({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Following not found',
      });
    });
  });

  describe('update', () => {
    it('should update a job seeker and return the updated job seeker', async () => {
      const id = 'someUserId';
      const updatedJobSeeker = {
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
      };
      const initialJobSeeker = {
        userId: 'testingJohn',
        userName: 'johndoe',
        email: 'johndoe@example.com',
        password: 'securepassword',
        contactNo: '555-12345',
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
      };
      jest
        .spyOn(jobSeekerRepository, 'findOneBy')
        .mockResolvedValue(initialJobSeeker);
      jest
        .spyOn(jobSeekerRepository, 'save')
        .mockResolvedValue(updatedJobSeeker);
      const result = await service.update(id, updatedJobSeeker);
      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Job seeker updated',
        data: updatedJobSeeker,
      });
    });

    it('should throw a not found exception if job seeker is not found', async () => {
      const id = 'someUserId';
      const updatedJobSeeker = {
        userId: 'testingJohn',
        userName: 'updatedName',
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
      };
      jest.spyOn(jobSeekerRepository, 'findOneBy').mockResolvedValue(null);
      await expect(service.update(id, updatedJobSeeker)).rejects.toThrow(
        new HttpException('Job seeker id not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('findAll', () => {
    it('should return all job seekers', async () => {
      const jobSeekers = [
        {
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
          userId: 'testingJohn1',
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
      ];
      jest.spyOn(jobSeekerRepository, 'find').mockResolvedValue(jobSeekers);
      const result = await service.findAll();
      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Job seeker found',
        data: jobSeekers,
      });
    });

    it('should throw a not found exception if no job seekers are found', async () => {
      jest.spyOn(jobSeekerRepository, 'find').mockResolvedValue([]);
      await expect(service.findAll()).rejects.toThrow(
        new HttpException('Job seeker not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('findAllWithSimilarity', () => {
    it('should return all job seekers with similarity scores', async () => {
      // Mock data setup
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
      const jobListing = new JobListing({
        jobListingId: 1,
        title: 'Software Engineer',
        overview: 'We are looking for a software engineer to join our team.',
        responsibilities: 'Develop and maintain software applications.',
        requirements: "Bachelor's degree in computer science or related field.",
        requiredDocuments: 'Resume, cover letter.',
        jobLocation: 'New York, NY',
        listingDate: new Date(),
        averageSalary: 80000,
        jobStartDate: new Date('2023-01-01'),
        jobListingStatus: JobListingStatusEnum.APPROVED,
        payRange: '$70,000 - $90,000',
        jobType: 'Full-time',
        schedule: '9 to 5',
        supplementalPay: 'Bonus',
        otherBenefits: 'Health insurance, 401(k)',
        certificationsRequired: 'None',
        typeOfWorkers: 'Employees',
        requiredLanguages: 'English',
        otherConsiderations: 'Must be authorized to work in the US.',
      });

      const corporate = new Corporate({
        userName: 'corporate1',
        email: 'corporate1@example.com',
        password: 'examplePassword',
      });

      // Set properties of Corporate class
      corporate.companyName = 'Example Company';
      corporate.schoolCategory = 'Example Category';
      corporate.companyRegistrationId = 12345;
      corporate.profilePictureUrl = 'example-url.com';
      corporate.companyAddress = '123 Example St.';
      corporate.postalCode = '12345';
      corporate.regions = 'Example Region';
      corporate.stripeSubId = 'example-sub-id';
      corporate.stripeCustId = 'example-cust-id';

      const similarJobSeekers = [
        { userId: '1', similarity: 0.9 },
        { userId: '2', similarity: 0.8 },
      ];

      jest.spyOn(jobSeekerRepository, 'find').mockResolvedValue(jobSeekers);
      jest.spyOn(jobListingRepository, 'findOne').mockResolvedValue(jobListing);
      jest.spyOn(corporateRepository, 'findOne').mockResolvedValue(corporate);
      jest
        .spyOn(service, 'calculateSimilarity')
        .mockResolvedValue(similarJobSeekers);

      const result = await service.findAllWithSimilarity(jobListingId);
      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Job seeker found',
        data: similarJobSeekers,
      });
    });

    it('should throw a not found exception if no job seekers are found', async () => {
      const jobListingId = 1;
      jest.spyOn(jobSeekerRepository, 'find').mockResolvedValue([]);
      await expect(service.findAllWithSimilarity(jobListingId)).rejects.toThrow(
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
      await expect(service.findAllWithSimilarity(jobListingId)).rejects.toThrow(
        new HttpException('Failed to find job listing', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw a not found exception if the corporate is not found', async () => {
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
      const jobListing = new JobListing({
        jobListingId: 1,
        title: 'Software Engineer',
        overview: 'We are looking for a software engineer to join our team.',
        responsibilities: 'Develop and maintain software applications.',
        requirements: "Bachelor's degree in computer science or related field.",
        requiredDocuments: 'Resume, cover letter.',
        jobLocation: 'New York, NY',
        listingDate: new Date(),
        averageSalary: 80000,
        jobStartDate: new Date('2023-01-01'),
        jobListingStatus: JobListingStatusEnum.APPROVED,
        payRange: '$70,000 - $90,000',
        jobType: 'Full-time',
        schedule: '9 to 5',
        supplementalPay: 'Bonus',
        otherBenefits: 'Health insurance, 401(k)',
        certificationsRequired: 'None',
        typeOfWorkers: 'Employees',
        requiredLanguages: 'English',
        otherConsiderations: 'Must be authorized to work in the US.',
      });
      jest.spyOn(jobSeekerRepository, 'find').mockResolvedValue(jobSeekers);
      jest.spyOn(jobListingRepository, 'findOne').mockResolvedValue(jobListing);
      jest.spyOn(corporateRepository, 'findOne').mockResolvedValue(null);
      await expect(service.findAllWithSimilarity(jobListingId)).rejects.toThrow(
        new HttpException('Failed to find corporate', HttpStatus.NOT_FOUND),
      );
    });

    it('should calculate similarity correctly', async () => {
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
      const jobListing = new JobListing({
        jobListingId: 1,
        title: 'Software Engineer',
        overview: 'We are looking for a software engineer to join our team.',
        responsibilities: 'Develop and maintain software applications.',
        requirements: "Bachelor's degree in computer science or related field.",
        requiredDocuments: 'Resume, cover letter.',
        jobLocation: 'New York, NY',
        listingDate: new Date(),
        averageSalary: 80000,
        jobStartDate: new Date('2023-01-01'),
        jobListingStatus: JobListingStatusEnum.APPROVED,
        payRange: '$70,000 - $90,000',
        jobType: 'Full-time',
        schedule: '9 to 5',
        supplementalPay: 'Bonus',
        otherBenefits: 'Health insurance, 401(k)',
        certificationsRequired: 'None',
        typeOfWorkers: 'Employees',
        requiredLanguages: 'English',
        otherConsiderations: 'Must be authorized to work in the US.',
      });

      const corporate = new Corporate({
        userName: 'corporate1',
        email: 'corporate1@example.com',
        password: 'examplePassword',
      });

      const similarJobSeekers = [
        { userId: '1', similarity: 0.9 },
        { userId: '2', similarity: 0.8 },
      ];
      jest.spyOn(jobSeekerRepository, 'find').mockResolvedValue(jobSeekers);
      jest.spyOn(jobListingRepository, 'findOne').mockResolvedValue(jobListing);
      jest.spyOn(corporateRepository, 'findOne').mockResolvedValue(corporate);
      const calculateSimilaritySpy = jest
        .spyOn(service, 'calculateSimilarity')
        .mockResolvedValue(similarJobSeekers);

      await service.findAllWithSimilarity(jobListingId);

      expect(calculateSimilaritySpy).toHaveBeenCalledWith(
        jobSeekers,
        corporate,
      );
    });
  });

  describe('remove', () => {
    it('should remove a job seeker and return the result', async () => {
      const id = 'someUserId';
      const result = new DeleteResult();
      result.affected = 1;
      result.raw = {};
      jest.spyOn(jobSeekerRepository, 'delete').mockResolvedValue(result);
      const response = await service.remove(id);
      expect(response).toEqual(result);
    });

    it('should throw a not found exception if job seeker is not found', async () => {
      const id = 'someUserId';
      const result = new DeleteResult();
      result.affected = 0;
      result.raw = {};
      jest.spyOn(jobSeekerRepository, 'delete').mockResolvedValue(result);
      await expect(service.remove(id)).rejects.toThrow(
        new HttpException('Job seeker id not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw a bad request exception if there is a database error', async () => {
      const id = 'someUserId';
      jest
        .spyOn(jobSeekerRepository, 'delete')
        .mockRejectedValue(new Error('Database error'));
      await expect(service.remove(id)).rejects.toThrow(
        new HttpException(
          'Database error',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });
});
