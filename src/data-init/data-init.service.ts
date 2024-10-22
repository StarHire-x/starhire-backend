import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Administrator } from '../entities/administrator.entity';
import UserRoleEnum from '../enums/userRole.enum';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateAdministratorDto } from '../administrator/dto/create-admin.dto';
import { AdministratorService } from '../administrator/admin.service';
import { Recruiter } from '../entities/recruiter.entity';
import { RecruiterService } from '../recruiter/recruiter.service';
import { Corporate } from '../entities/corporate.entity';
import { CorporateService } from '../corporate/corporate.service';
import { JobSeeker } from '../entities/jobSeeker.entity';
import { JobSeekerService } from '../job-seeker/job-seeker.service';
import { CreateRecruiterDto } from '../recruiter/dto/create-recruiter.dto';
import { CreateCorporateDto } from '../corporate/dto/create-corporate.dto';
import { CreateJobSeekerDto } from '../job-seeker/dto/create-job-seeker.dto';
import { JobListing } from '../entities/jobListing.entity';
import { JobListingService } from '../job-listing/job-listing.service';
import { CreateJobListingDto } from '../job-listing/dto/create-job-listing.dto';
import JobListingStatusEnum from '../enums/jobListingStatus.enum';
import { ForumCategory } from '../entities/forumCategory.entity';
import { ForumCategoriesService } from '../forum-categories/forum-categories.service';
import { CreateForumCategoryDto } from '../forum-categories/dto/create-forum-category.dto';
import { Ticket } from '../entities/ticket.entity';
import { TicketService } from '../ticket/ticket.service';
import { CreateTicketDto } from '../ticket/dto/create-ticket.dto';
import TicketCategoryEnum from '../enums/ticketCategory.enum';
import { JobPreference } from '../entities/jobPreference.entity';
import { JobPreferenceService } from '../job-preference/job-preference.service';
import { CreateJobPreferenceDto } from '../job-preference/dto/create-job-preference.dto';
import { ForumPost } from '../entities/forumPost.entity';
import { ForumPostsService } from '../forum-posts/forum-posts.service';
import ForumPostEnum from '../enums/forumPost.enum';
import { CommissionRate } from '../entities/commissionRate.entity';
import { CommissionRateService } from '../commission-rate/commission-rate.service';
import { CreateCommissionRateDto } from '../commission-rate/dto/create-commission-rate.dto';
import { CreateJobApplicationDto } from 'src/job-application/dto/create-job-application.dto';
import JobApplicationStatusEnum from 'src/enums/jobApplicationStatus.enum';
import { JobApplication } from 'src/entities/jobApplication.entity';
import { JobApplicationService } from 'src/job-application/job-application.service';
import { CreateDocumentDto } from 'src/document/dto/create-document.dto';
import { CreateJobAssignmentDto } from 'src/job-assignment/dto/create-job-assignment.dto';
import { JobAssignment } from 'src/entities/jobAssignment.entity';
import { JobAssignmentService } from 'src/job-assignment/job-assignment.service';
import NotificationModeEnum from 'src/enums/notificationMode.enum';
require('dotenv').config();

@Injectable()
export class DataInitService implements OnModuleInit {
  constructor(
    @InjectRepository(Administrator)
    private readonly administratorRepository: Repository<Administrator>,
    private readonly administratorService: AdministratorService,
    @InjectRepository(Recruiter)
    private readonly recruiterRepository: Repository<Recruiter>,
    private readonly recruiterService: RecruiterService,
    @InjectRepository(Corporate)
    private readonly corporateRepository: Repository<Corporate>,
    private readonly corporateService: CorporateService,
    @InjectRepository(JobSeeker)
    private readonly jobSeekerRepository: Repository<JobSeeker>,
    private readonly jobSeekerService: JobSeekerService,
    @InjectRepository(JobListing)
    private readonly jobListingRepository: Repository<JobListing>,
    private readonly jobListingService: JobListingService,
    @InjectRepository(ForumCategory)
    private readonly forumCategoryRepository: Repository<ForumCategory>,
    private readonly forumCategoryService: ForumCategoriesService,
    @InjectRepository(ForumPost)
    private readonly forumPostRepository: Repository<ForumPost>,
    private readonly forumPostService: ForumPostsService,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    private readonly ticketService: TicketService,
    @InjectRepository(JobPreference)
    private readonly jobPreferenceRepository: Repository<JobPreference>,
    private readonly jobPreferenceService: JobPreferenceService,
    @InjectRepository(CommissionRate)
    private readonly commissionRateRepository: Repository<CommissionRate>,
    private readonly commissionRateService: CommissionRateService,
    @InjectRepository(JobApplication)
    private readonly jobApplicationRepository: Repository<JobApplication>,
    private readonly jobApplicationService: JobApplicationService,
    @InjectRepository(JobAssignment)
    private readonly jobAssignmentRepository: Repository<JobAssignment>,
    private readonly jobAssignmentService: JobAssignmentService,
  ) {}

  async onModuleInit() {
    await this.initializeData();
  }

  async initializeData() {
    // if there's any existing commission rate, don't data init commission rate
    const existingCommissionRates = await this.commissionRateService.findAll();
    if (existingCommissionRates.length == 0) {
      // 10% commission rate creation
      const createCommissionRateDto: CreateCommissionRateDto =
        new CreateCommissionRateDto();
      createCommissionRateDto.commissionRate = 10;

      await this.commissionRateService.create(createCommissionRateDto);
      console.log(
        `Commission Rate of ${createCommissionRateDto.commissionRate}% is created.`,
      );
    }

    // Admin account creation
    const hashedAdminPassword = await bcrypt.hash(process.env.ADMIN_PW, 5);
    const createAdministratorDto: CreateAdministratorDto =
      new CreateAdministratorDto();
    createAdministratorDto.userName = 'admin';
    createAdministratorDto.password = hashedAdminPassword;
    createAdministratorDto.email = 'admin@gmail.com';
    createAdministratorDto.contactNo = '05854749';
    createAdministratorDto.role = UserRoleEnum.ADMINISTRATOR;
    createAdministratorDto.createdAt = new Date('2023-08-27');
    createAdministratorDto.fullName = 'Administrator';
    createAdministratorDto.profilePictureUrl =
      'https://starhire-uploader.s3.ap-southeast-2.amazonaws.com/admin1.jpg';
    // check if this data init admin exists in db or not
    const existingAdmin = await this.administratorRepository.findOne({
      where: {
        userName: createAdministratorDto.userName,
        email: createAdministratorDto.email,
      },
    });

    // if data init admin does not exist, means we can create the data init admin
    if (!existingAdmin) {
      await this.administratorService.create(createAdministratorDto);
      console.log(
        `Data initialized this admin account ${createAdministratorDto.email} successfully!`,
      );
    }

    // Admin with working email account creation
    const hashedAdminWorkingEmailPassword = await bcrypt.hash(
      process.env.ADMIN_PW,
      5,
    );
    const createAdministratorWorkingEmailDto: CreateAdministratorDto =
      new CreateAdministratorDto();
    createAdministratorWorkingEmailDto.userName = 'workingAdmin';
    createAdministratorWorkingEmailDto.password =
      hashedAdminWorkingEmailPassword;
    createAdministratorWorkingEmailDto.email = 'dragonplatoon1@gmail.com';
    createAdministratorWorkingEmailDto.contactNo = '36747489';
    createAdministratorWorkingEmailDto.role = UserRoleEnum.ADMINISTRATOR;
    createAdministratorWorkingEmailDto.createdAt = new Date('2023-08-28');
    createAdministratorWorkingEmailDto.fullName = 'Working Admin';
    createAdministratorWorkingEmailDto.profilePictureUrl =
      'https://starhire-uploader.s3.ap-southeast-2.amazonaws.com/admin1.jpg';
    createAdministratorWorkingEmailDto.notificationMode =
      NotificationModeEnum.EMAIL;

    const existingWorkingEmailAdmin =
      await this.administratorRepository.findOne({
        where: {
          userName: createAdministratorWorkingEmailDto.userName,
          email: createAdministratorWorkingEmailDto.email,
        },
      });

    // if data init admin does not exist, means we can create the data init admin
    if (!existingWorkingEmailAdmin) {
      await this.administratorService.create(
        createAdministratorWorkingEmailDto,
      );
      console.log(
        `Data initialized this admin account ${createAdministratorWorkingEmailDto.email} successfully!`,
      );
    }

    // Recruiter account creation
    const hashedRecruiterPassword = await bcrypt.hash(
      process.env.RECRUITER_PW,
      5,
    );
    const createRecruiterDto: CreateRecruiterDto = new CreateRecruiterDto();
    createRecruiterDto.userName = 'recruiter';
    createRecruiterDto.password = hashedRecruiterPassword;
    createRecruiterDto.email = 'recruiter@gmail.com';
    createRecruiterDto.contactNo = '65415522';
    createRecruiterDto.role = UserRoleEnum.RECRUITER;
    createRecruiterDto.createdAt = new Date('2023-09-03');
    createRecruiterDto.profilePictureUrl =
      'https://starhire-uploader.s3.ap-southeast-2.amazonaws.com/recruiter1.jpg';
    createRecruiterDto.fullName = 'Recrutier Lia';

    const existingRecruiter = await this.recruiterRepository.findOne({
      where: {
        userName: createRecruiterDto.userName,
        email: createRecruiterDto.email,
      },
    });

    // if data init recruiter does not exist, means we can create the data init recruiter
    if (!existingRecruiter) {
      await this.recruiterService.create(createRecruiterDto);
      console.log(
        `Data initialized this recruiter account ${createRecruiterDto.email} successfully!`,
      );
    }

    // Recruiter account creation with working email
    const hashedRecruiterWorkingEmailPassword = await bcrypt.hash(
      process.env.RECRUITER_PW,
      5,
    );
    const createRecruiterWorkingEmailDto: CreateRecruiterDto =
      new CreateRecruiterDto();
    createRecruiterWorkingEmailDto.userName = 'workingRecruiter';
    createRecruiterWorkingEmailDto.password =
      hashedRecruiterWorkingEmailPassword;
    createRecruiterWorkingEmailDto.email = 'dragonplatoon2@gmail.com';
    createRecruiterWorkingEmailDto.contactNo = '34536673';
    createRecruiterWorkingEmailDto.role = UserRoleEnum.RECRUITER;
    createRecruiterWorkingEmailDto.createdAt = new Date('2023-09-13');
    createRecruiterWorkingEmailDto.profilePictureUrl =
      'https://starhire-uploader.s3.ap-southeast-2.amazonaws.com/recruiter1.jpg';
    createRecruiterWorkingEmailDto.fullName = 'Working Recruiter';
    createRecruiterWorkingEmailDto.notificationMode =
      NotificationModeEnum.EMAIL;

    const existingWorkingEmailRecruiter =
      await this.recruiterRepository.findOne({
        where: {
          userName: createRecruiterWorkingEmailDto.userName,
          email: createRecruiterWorkingEmailDto.email,
        },
      });

    // if data init recruiter does not exist, means we can create the data init recruiter
    if (!existingWorkingEmailRecruiter) {
      await this.recruiterService.create(createRecruiterWorkingEmailDto);
      console.log(
        `Data initialized this recruiter account ${createRecruiterWorkingEmailDto.email} successfully!`,
      );
    }

    // Corporate account creation
    const hashedCorporatePassword = await bcrypt.hash(
      process.env.CORPORATE_PW,
      5,
    );
    const createCorporateDto: CreateCorporateDto = new CreateCorporateDto();
    createCorporateDto.userName = 'corporate';
    createCorporateDto.password = hashedCorporatePassword;
    createCorporateDto.email = 'corporate@gmail.com';
    createCorporateDto.contactNo = '65415523';
    createCorporateDto.role = UserRoleEnum.CORPORATE;
    createCorporateDto.createdAt = new Date('2023-09-15');
    createCorporateDto.companyRegistrationId = 177452096;
    createCorporateDto.profilePictureUrl =
      'https://starhire-uploader.s3.ap-southeast-2.amazonaws.com/binance-coin-bnb-logo-CD94CC6D31-seeklogo.com.png';
    createCorporateDto.companyName = 'Corporate Pte Ltd';

    const existingCorporate = await this.corporateRepository.findOne({
      where: {
        userName: createCorporateDto.userName,
        email: createCorporateDto.email,
      },
    });

    // if data init corporate does not exist, means we can create the data init corporate
    if (!existingCorporate) {
      await this.corporateService.create(createCorporateDto);
      console.log(
        `Data initialized this corporate account ${createCorporateDto.email} successfully!`,
      );
    }

    // Corporate account pawfect pawfectis3106@gmail.com creation
    const hashedCorporateTwoPassword = await bcrypt.hash(
      process.env.CORPORATE_PW,
      5,
    );
    const createCorporateTwoDto: CreateCorporateDto = new CreateCorporateDto();
    createCorporateTwoDto.userName = 'pawfectis3106';
    createCorporateTwoDto.password = hashedCorporateTwoPassword;
    createCorporateTwoDto.email = 'pawfectis3106@gmail.com';
    createCorporateTwoDto.contactNo = '65415529';
    createCorporateTwoDto.role = UserRoleEnum.CORPORATE;
    createCorporateTwoDto.createdAt = new Date('2023-09-15');
    createCorporateTwoDto.companyRegistrationId = 177452074;
    createCorporateTwoDto.profilePictureUrl =
      'https://starhire-uploader.s3.ap-southeast-2.amazonaws.com/Scenery+8.jpg';
    createCorporateTwoDto.companyName = 'Pawfect Pte Ltd';

    const existingCorporateTwo = await this.corporateRepository.findOne({
      where: {
        userName: createCorporateTwoDto.userName,
        email: createCorporateTwoDto.email,
      },
    });

    // if data init corporate does not exist, means we can create the data init corporate
    if (!existingCorporateTwo) {
      await this.corporateService.create(createCorporateTwoDto);
      console.log(
        `Data initialized this corporate account ${createCorporateTwoDto.email} successfully!`,
      );
    }

    // Corporate account MapleBear maplebear99@gmail.com creation
    const hashedCorporateThreePassword = await bcrypt.hash(
      process.env.CORPORATE_PW,
      5,
    );
    const createCorporateThreeDto: CreateCorporateDto =
      new CreateCorporateDto();
    createCorporateThreeDto.userName = 'MapleBear';
    createCorporateThreeDto.password = hashedCorporateThreePassword;
    createCorporateThreeDto.email = 'maplebear99@gmail.com';
    createCorporateThreeDto.contactNo = '66816711';
    createCorporateThreeDto.role = UserRoleEnum.CORPORATE;
    createCorporateThreeDto.createdAt = new Date('2023-09-17');
    createCorporateThreeDto.companyRegistrationId = 177452082;
    createCorporateThreeDto.profilePictureUrl =
      'https://starhire-uploader.s3.ap-southeast-2.amazonaws.com/MapleBearLogo.png';
    createCorporateThreeDto.companyName = 'Maple Bear Pte Ltd';

    const existingCorporateThree = await this.corporateRepository.findOne({
      where: {
        userName: createCorporateThreeDto.userName,
        email: createCorporateThreeDto.email,
      },
    });

    // if data init corporate does not exist, means we can create the data init corporate
    if (!existingCorporateThree) {
      await this.corporateService.create(createCorporateThreeDto);
      console.log(
        `Data initialized this corporate account ${createCorporateThreeDto.email} successfully!`,
      );
    }

    // Corporate account Growing Minds Preschool growingminds@gmail.com creation
    const hashedCorporateFourPassword = await bcrypt.hash(
      process.env.CORPORATE_PW,
      5,
    );
    const createCorporateFourDto: CreateCorporateDto = new CreateCorporateDto();
    createCorporateFourDto.userName = 'GrowingMinds';
    createCorporateFourDto.password = hashedCorporateFourPassword;
    createCorporateFourDto.email = 'growingminds@gmail.com';
    createCorporateFourDto.contactNo = '66816712';
    createCorporateFourDto.role = UserRoleEnum.CORPORATE;
    createCorporateFourDto.createdAt = new Date('2023-09-20');
    createCorporateFourDto.companyRegistrationId = 177452083;
    createCorporateFourDto.profilePictureUrl =
      'https://starhire-uploader.s3.ap-southeast-2.amazonaws.com/growingminds.png';
    createCorporateFourDto.companyName = 'Growing Minds Preschool Pte Ltd';

    const existingCorporateFour = await this.corporateRepository.findOne({
      where: {
        userName: createCorporateFourDto.userName,
        email: createCorporateFourDto.email,
      },
    });

    // if data init corporate does not exist, means we can create the data init corporate
    if (!existingCorporateFour) {
      await this.corporateService.create(createCorporateFourDto);
      console.log(
        `Data initialized this corporate account ${createCorporateFourDto.email} successfully!`,
      );
    }

    // Corporate account creation with working email
    const hashedCorporateWorkingEmailPassword = await bcrypt.hash(
      process.env.CORPORATE_PW,
      5,
    );
    const createCorporateWorkingEmailDto: CreateCorporateDto =
      new CreateCorporateDto();
    createCorporateWorkingEmailDto.userName = 'workingCorporate';
    createCorporateWorkingEmailDto.password =
      hashedCorporateWorkingEmailPassword;
    createCorporateWorkingEmailDto.email = 'dragonplatoon3@gmail.com';
    createCorporateWorkingEmailDto.contactNo = '84568580';
    createCorporateWorkingEmailDto.role = UserRoleEnum.CORPORATE;
    createCorporateWorkingEmailDto.createdAt = new Date('2023-09-28');
    createCorporateWorkingEmailDto.companyRegistrationId = 177452099;
    createCorporateWorkingEmailDto.profilePictureUrl =
      'https://starhire-uploader.s3.ap-southeast-2.amazonaws.com/binance-coin-bnb-logo-CD94CC6D31-seeklogo.com.png';
    createCorporateWorkingEmailDto.companyName = 'Working Corporate Pte Ltd';
    createCorporateWorkingEmailDto.notificationMode =
      NotificationModeEnum.EMAIL;

    const existingWorkingCorporate = await this.corporateRepository.findOne({
      where: {
        userName: createCorporateWorkingEmailDto.userName,
        email: createCorporateWorkingEmailDto.email,
      },
    });

    // if data init corporate does not exist, means we can create the data init corporate
    if (!existingWorkingCorporate) {
      await this.corporateService.create(createCorporateWorkingEmailDto);
      console.log(
        `Data initialized this corporate account ${createCorporateWorkingEmailDto.email} successfully!`,
      );
    }

    // Job Seeker account jobseeker jobseeker@gmail.com creation
    const hashedJobSeekerPassword = await bcrypt.hash(
      process.env.JOBSEEKER_PW,
      5,
    );
    const createJobSeekerDto: CreateJobSeekerDto = new CreateJobSeekerDto();
    createJobSeekerDto.userName = 'jobseeker';
    createJobSeekerDto.password = hashedJobSeekerPassword;
    createJobSeekerDto.email = 'jobseeker@gmail.com';
    createJobSeekerDto.contactNo = '65415524';
    createJobSeekerDto.role = UserRoleEnum.JOBSEEKER;
    createJobSeekerDto.createdAt = new Date('2023-09-12');
    createJobSeekerDto.fullName = 'David Tan';
    createJobSeekerDto.dateOfBirth = new Date('2000-10-09');
    createJobSeekerDto.homeAddress = '123 King St';
    createJobSeekerDto.profilePictureUrl =
      'https://starhire-uploader.s3.ap-southeast-2.amazonaws.com/jobseeker1.jpg';

    let existingJobSeeker = await this.jobSeekerRepository.findOne({
      where: {
        userName: createJobSeekerDto.userName,
        email: createJobSeekerDto.email,
      },
    });

    // if data init job seeker does not exist, means we can create the data init job seeker
    if (!existingJobSeeker) {
      existingJobSeeker = (
        await this.jobSeekerService.create(createJobSeekerDto)
      )?.data;
      console.log(
        `Data initialized this job seeker account ${createJobSeekerDto.email} successfully!`,
      );
    }

    // Job Seeker account jobseeker2 jobseeker2@gmail.com creation
    const hashedJobSeekerTwoPassword = await bcrypt.hash(
      process.env.JOBSEEKER_PW,
      5,
    );
    const createJobSeekerTwoDto: CreateJobSeekerDto = new CreateJobSeekerDto();
    createJobSeekerTwoDto.userName = 'jobseeker2';
    createJobSeekerTwoDto.password = hashedJobSeekerTwoPassword;
    createJobSeekerTwoDto.email = 'jobseeker2@gmail.com';
    createJobSeekerTwoDto.contactNo = '92345678';
    createJobSeekerTwoDto.role = UserRoleEnum.JOBSEEKER;
    createJobSeekerTwoDto.createdAt = new Date('2023-09-15');
    createJobSeekerTwoDto.fullName = 'George Tan';
    createJobSeekerTwoDto.dateOfBirth = new Date('2000-10-09');
    createJobSeekerTwoDto.homeAddress = '123 King St';
    createJobSeekerTwoDto.profilePictureUrl =
      'https://starhire-uploader.s3.ap-southeast-2.amazonaws.com/jobseeker2.jpg';

    let existingJobSeekerTwo = await this.jobSeekerRepository.findOne({
      where: {
        userName: createJobSeekerTwoDto.userName,
        email: createJobSeekerTwoDto.email,
      },
    });

    // if data init job seeker does not exist, means we can create the data init job seeker
    if (!existingJobSeekerTwo) {
      existingJobSeekerTwo = (
        await this.jobSeekerService.create(createJobSeekerTwoDto)
      )?.data;
      console.log(
        `Data initialized this job seeker account ${createJobSeekerTwoDto.email} successfully!`,
      );
    }

    // Job Seeker account jobseeker3 jobseeker3@gmail.com creation
    const hashedJobSeekerThreePassword = await bcrypt.hash(
      process.env.JOBSEEKER_PW,
      5,
    );
    const createJobSeekerThreeDto: CreateJobSeekerDto =
      new CreateJobSeekerDto();
    createJobSeekerThreeDto.userName = 'jobseeker3';
    createJobSeekerThreeDto.password = hashedJobSeekerThreePassword;
    createJobSeekerThreeDto.email = 'jobseeker3@gmail.com';
    createJobSeekerThreeDto.contactNo = '92445638';
    createJobSeekerThreeDto.role = UserRoleEnum.JOBSEEKER;
    createJobSeekerThreeDto.createdAt = new Date('2023-10-15');
    createJobSeekerThreeDto.fullName = 'Patrick Tan';
    createJobSeekerThreeDto.dateOfBirth = new Date('2000-10-09');
    createJobSeekerThreeDto.homeAddress = '123 King St';
    createJobSeekerThreeDto.profilePictureUrl =
      'https://starhire-uploader.s3.ap-southeast-2.amazonaws.com/jobseeker3.jpg';

    let existingJobSeekerThree = await this.jobSeekerRepository.findOne({
      where: {
        userName: createJobSeekerThreeDto.userName,
        email: createJobSeekerThreeDto.email,
      },
    });

    // if data init job seeker does not exist, means we can create the data init job seeker
    if (!existingJobSeekerThree) {
      existingJobSeekerThree = (
        await this.jobSeekerService.create(createJobSeekerThreeDto)
      )?.data;
      console.log(
        `Data initialized this job seeker account ${createJobSeekerThreeDto.email} successfully!`,
      );
    }

    // Job Seeker account create working email
    const hashedJobSeekerWorkingEmailPassword = await bcrypt.hash(
      process.env.JOBSEEKER_PW,
      5,
    );
    const createJobSeekerWorkingEmailDto: CreateJobSeekerDto =
      new CreateJobSeekerDto();
    createJobSeekerWorkingEmailDto.userName = 'workingJobSeeker';
    createJobSeekerWorkingEmailDto.password =
      hashedJobSeekerWorkingEmailPassword;
    createJobSeekerWorkingEmailDto.email = 'dragonplatoon4@gmail.com';
    createJobSeekerWorkingEmailDto.contactNo = '84568580';
    createJobSeekerWorkingEmailDto.role = UserRoleEnum.JOBSEEKER;
    createJobSeekerWorkingEmailDto.createdAt = new Date('2023-11-11');
    createJobSeekerWorkingEmailDto.fullName = 'Desmond Leong';
    createJobSeekerWorkingEmailDto.dateOfBirth = new Date('1970-10-09');
    createJobSeekerWorkingEmailDto.homeAddress = '123 King St';
    createJobSeekerWorkingEmailDto.profilePictureUrl =
      'https://starhire-uploader.s3.ap-southeast-2.amazonaws.com/jobseeker1.jpg';
    createJobSeekerWorkingEmailDto.notificationMode =
      NotificationModeEnum.EMAIL;

    let existingJobSeekerWorkingEmail = await this.jobSeekerRepository.findOne({
      where: {
        userName: createJobSeekerWorkingEmailDto.userName,
        email: createJobSeekerWorkingEmailDto.email,
      },
    });

    // if data init job seeker does not exist, means we can create the data init job seeker
    if (!existingJobSeekerWorkingEmail) {
      existingJobSeekerWorkingEmail = (
        await this.jobSeekerService.create(createJobSeekerWorkingEmailDto)
      )?.data;
      console.log(
        `Data initialized this job seeker account ${createJobSeekerWorkingEmailDto.email} successfully!`,
      );
    }

    // at here, all 4 types of accounts will be valid, use them to link up with other entities
    const createdAdmin = await this.administratorRepository.findOne({
      where: {
        userName: createAdministratorDto.userName,
        email: createAdministratorDto.email,
      },
    });

    const createdAdminWorkingEmail = await this.administratorRepository.findOne(
      {
        where: {
          userName: createAdministratorWorkingEmailDto.userName,
          email: createAdministratorWorkingEmailDto.email,
        },
      },
    );

    const createdRecruiter = await this.recruiterRepository.findOne({
      where: {
        userName: createRecruiterDto.userName,
        email: createRecruiterDto.email,
      },
    });

    const createdRecruiterWorkingEmail = await this.recruiterRepository.findOne(
      {
        where: {
          userName: createRecruiterWorkingEmailDto.userName,
          email: createRecruiterWorkingEmailDto.email,
        },
      },
    );

    const createdCorporate = await this.corporateRepository.findOne({
      where: {
        userName: createCorporateDto.userName,
        email: createCorporateDto.email,
      },
    });

    const createdCorporateTwo = await this.corporateRepository.findOne({
      where: {
        userName: createCorporateTwoDto.userName,
        email: createCorporateTwoDto.email,
      },
    });

    const createdCorporateThree = await this.corporateRepository.findOne({
      where: {
        userName: createCorporateThreeDto.userName,
        email: createCorporateThreeDto.email,
      },
    });

    const createdCorporateFour = await this.corporateRepository.findOne({
      where: {
        userName: createCorporateFourDto.userName,
        email: createCorporateFourDto.email,
      },
    });

    const createdCorporateWorkingEmail = await this.corporateRepository.findOne(
      {
        where: {
          userName: createCorporateWorkingEmailDto.userName,
          email: createCorporateWorkingEmailDto.email,
        },
      },
    );

    const createdJobSeeker = await this.jobSeekerRepository.findOne({
      where: {
        userName: createJobSeekerDto.userName,
        email: createJobSeekerDto.email,
      },
    });

    const createdJobSeekerTwo = await this.jobSeekerRepository.findOne({
      where: {
        userName: createJobSeekerTwoDto.userName,
        email: createJobSeekerTwoDto.email,
      },
    });

    const createdJobSeekerThree = await this.jobSeekerRepository.findOne({
      where: {
        userName: createJobSeekerThreeDto.userName,
        email: createJobSeekerThreeDto.email,
      },
    });

    const createdJobSeekerWorkingEmail = await this.jobSeekerRepository.findOne(
      {
        where: {
          userName: createJobSeekerWorkingEmailDto.userName,
          email: createJobSeekerWorkingEmailDto.email,
        },
      },
    );

    // if any of the accounts not valid, don't proceed data init
    if (
      !createdAdmin ||
      !createdAdminWorkingEmail ||
      !createdRecruiter ||
      !createdRecruiterWorkingEmail ||
      !createdCorporate ||
      !createdCorporateTwo ||
      !createdCorporateThree ||
      !createdCorporateFour ||
      !createdCorporateWorkingEmail ||
      !createdJobSeeker ||
      !createdJobSeekerTwo ||
      !createdJobSeekerThree ||
      !createdJobSeekerWorkingEmail
    ) {
      return;
    }

    // if there's any existing job preference, don't data init job preferences;
    const existingJobPreference = await this.jobPreferenceRepository.find();
    if (existingJobPreference.length > 0) {
      return;
    }

    // jobPreference 1 creation
    const createJobPreferenceDto: CreateJobPreferenceDto =
      new CreateJobPreferenceDto();
    createJobPreferenceDto.benefitPreference = 3;
    createJobPreferenceDto.salaryPreference = 4;
    createJobPreferenceDto.workLifeBalancePreference = 3;
    createJobPreferenceDto.jobSeekerId = createdJobSeeker.userId;

    await this.jobPreferenceService.create(createJobPreferenceDto);
    console.log(
      `job preference is created by jobseeker username ${createdJobSeeker.userName}`,
    );

    const createJobPreferenceTwoDto: CreateJobPreferenceDto =
      new CreateJobPreferenceDto();
    createJobPreferenceTwoDto.benefitPreference = 5;
    createJobPreferenceTwoDto.salaryPreference = 2;
    createJobPreferenceTwoDto.workLifeBalancePreference = 3;
    createJobPreferenceTwoDto.jobSeekerId = createdJobSeekerTwo.userId;

    await this.jobPreferenceService.create(createJobPreferenceTwoDto);
    console.log(
      `job preference is created by jobseeker username ${createdJobSeekerTwo.userName}`,
    );

    const createJobPreferenceThreeDto: CreateJobPreferenceDto =
      new CreateJobPreferenceDto();
    createJobPreferenceThreeDto.benefitPreference = 2;
    createJobPreferenceThreeDto.salaryPreference = 5;
    createJobPreferenceThreeDto.workLifeBalancePreference = 3;
    createJobPreferenceThreeDto.corporateId = createdCorporate.userId;

    await this.jobPreferenceService.create(createJobPreferenceThreeDto);
    console.log(
      `job preference is created by corporate username ${createdCorporate.userName}`,
    );

    const createJobPreferenceFourDto: CreateJobPreferenceDto =
      new CreateJobPreferenceDto();
    createJobPreferenceFourDto.benefitPreference = 1;
    createJobPreferenceFourDto.salaryPreference = 4;
    createJobPreferenceFourDto.workLifeBalancePreference = 5;
    createJobPreferenceFourDto.corporateId = createdCorporateTwo.userId;

    await this.jobPreferenceService.create(createJobPreferenceFourDto);
    console.log(
      `job preference is created by corporate username ${createdCorporateTwo.userName}`,
    );

    const createJobPreferenceFiveDto: CreateJobPreferenceDto =
      new CreateJobPreferenceDto();
    createJobPreferenceFiveDto.benefitPreference = 3;
    createJobPreferenceFiveDto.salaryPreference = 4;
    createJobPreferenceFiveDto.workLifeBalancePreference = 3;
    createJobPreferenceFiveDto.corporateId = createdCorporateThree.userId;

    await this.jobPreferenceService.create(createJobPreferenceFiveDto);
    console.log(
      `job preference is created by corporate username ${createdCorporateThree.userName}`,
    );

    const createJobPreferenceSixDto: CreateJobPreferenceDto =
      new CreateJobPreferenceDto();
    createJobPreferenceSixDto.benefitPreference = 3;
    createJobPreferenceSixDto.salaryPreference = 2;
    createJobPreferenceSixDto.workLifeBalancePreference = 5;
    createJobPreferenceSixDto.jobSeekerId = createdJobSeekerThree.userId;

    await this.jobPreferenceService.create(createJobPreferenceSixDto);
    console.log(
      `job preference is created by jobseeker username ${createdJobSeekerThree.userName}`,
    );

    const createJobPreferenceSevenDto: CreateJobPreferenceDto =
      new CreateJobPreferenceDto();
    createJobPreferenceSevenDto.benefitPreference = 3;
    createJobPreferenceSevenDto.salaryPreference = 2;
    createJobPreferenceSevenDto.workLifeBalancePreference = 5;
    createJobPreferenceSevenDto.jobSeekerId =
      createdJobSeekerWorkingEmail.userId;

    await this.jobPreferenceService.create(createJobPreferenceSevenDto);
    console.log(
      `job preference is created by jobseeker username ${createdJobSeekerWorkingEmail.userName}`,
    );

    const createJobPreferenceEightDto: CreateJobPreferenceDto =
      new CreateJobPreferenceDto();
    createJobPreferenceEightDto.benefitPreference = 3;
    createJobPreferenceEightDto.salaryPreference = 2;
    createJobPreferenceEightDto.workLifeBalancePreference = 5;
    createJobPreferenceEightDto.corporateId =
      createdCorporateWorkingEmail.userId;

    await this.jobPreferenceService.create(createJobPreferenceEightDto);
    console.log(
      `job preference is created by corporate username ${createdCorporateWorkingEmail.userName}`,
    );

    // if there's any existing job listings, don't data init job listings
    const existingJobListings = await this.jobListingRepository.find();
    if (existingJobListings.length > 0) {
      return;
    }

    // job listing 1 creation
    const createJobListingDto: CreateJobListingDto = new CreateJobListingDto();
    createJobListingDto.title = 'English Child Care Teacher';
    createJobListingDto.overview =
      'Looking for an L1 and L2 teachers for Tots and K1 class. Must have a DPT/ACEY.';
    createJobListingDto.responsibilities =
      "Take a class of 14 children with a Chinese teacher as a partner. Update parents on children's activities, curriculum, progress and well being. Works well with the other staff - team player.";
    createJobListingDto.requirements =
      'Must have a love for teaching and is passionate about children. Good classroom management skills. Speaks well and is a confident speaker.';
    createJobListingDto.jobLocation = 'Hillview, Singapore';
    createJobListingDto.averageSalary = 3000;
    createJobListingDto.jobStartDate = new Date('2023-12-12');
    createJobListingDto.listingDate = new Date('2023-10-10');
    createJobListingDto.requiredDocuments =
      'Early Childhood Graduation Cert,English Language Proficiency Cert,L1 Level Cert,L2 Level Cert';
    createJobListingDto.jobListingStatus = JobListingStatusEnum.APPROVED;
    createJobListingDto.corporateId = createdCorporateThree.userId;

    await this.jobListingService.create(createJobListingDto);
    console.log(
      `job listing ${createJobListingDto.title} is created by corporate username ${createdCorporateThree.userName}`,
    );

    // job listing 2 creation
    const createJobListingTwoDto: CreateJobListingDto =
      new CreateJobListingDto();
    createJobListingTwoDto.title = 'Chinese Child Care Teacher';
    createJobListingTwoDto.overview =
      'Looking for an L1 and L2 teachers for Tots and K1 class. Must have a DPT/ACEY.';
    createJobListingTwoDto.responsibilities =
      "Take a class of 14 children with an English teacher as a partner Update parents on children's activities, curriculum, progress and well being. Works well with the other staff - team player.";
    createJobListingTwoDto.requirements =
      'Must have a love for teaching and is passionate about children. Good classroom management skills. Speaks well and is a confident speaker.';
    createJobListingTwoDto.jobLocation = 'Kallang, Singapore';
    createJobListingTwoDto.averageSalary = 2800;
    createJobListingTwoDto.jobStartDate = new Date('2023-12-12');
    createJobListingTwoDto.listingDate = new Date('2023-10-12');
    createJobListingTwoDto.requiredDocuments =
      'Early Childhood Graduation Cert,Chinese Language Proficiency Cert,L1 Level Cert,L2 Level Cert';
    createJobListingTwoDto.jobListingStatus = JobListingStatusEnum.APPROVED;
    createJobListingTwoDto.corporateId = createdCorporateThree.userId;

    await this.jobListingService.create(createJobListingTwoDto);
    console.log(
      `job listing ${createJobListingTwoDto.title} is created by corporate username ${createdCorporateThree.userName}`,
    );

    // job listing 3 creation
    const createJobListingThreeDto: CreateJobListingDto =
      new CreateJobListingDto();
    createJobListingThreeDto.title = 'Infant Care Assistant Teacher';
    createJobListingThreeDto.overview =
      'Looking for a few infant care assistant teachers';
    createJobListingThreeDto.responsibilities =
      'Attends to the basic needs of children from 2 months to 17 months (Infant Care). Ensures children’s safety & well-being while under the centre’s care. Implements centre’s programmes and new initiatives.';
    createJobListingThreeDto.requirements =
      'Fundamentals Certificate in Early Childhood Care and Education (FECCE) is a bonus. At least 1 year of working experience in a related field.';
    createJobListingThreeDto.jobLocation = 'Yishun, Singapore';
    createJobListingThreeDto.averageSalary = 3200;
    createJobListingThreeDto.jobStartDate = new Date('2023-12-12');
    createJobListingThreeDto.listingDate = new Date('2023-10-22');
    createJobListingThreeDto.requiredDocuments =
      'Early Childhood Graduation Cert,Resume';
    createJobListingThreeDto.jobListingStatus = JobListingStatusEnum.APPROVED;
    createJobListingThreeDto.corporateId = createdCorporateThree.userId;

    await this.jobListingService.create(createJobListingThreeDto);
    console.log(
      `job listing ${createJobListingThreeDto.title} is created by corporate username ${createdCorporateThree.userName}`,
    );

    // job listing 4 creation, unverified job listing for pawfectis3106@gmail.com email demo
    const createJobListingFourDto: CreateJobListingDto =
      new CreateJobListingDto();
    createJobListingFourDto.title = 'Preschool Educator';
    createJobListingFourDto.overview = 'Looking for a few Preschool Educators';
    createJobListingFourDto.responsibilities =
      'Taking care of young childrens.';
    createJobListingFourDto.requirements =
      'Passionate in nurturing and educating the young children. Has good communications and interpersonal skills. Accredited L1/L2 / ACEY by ECDA. Has at lease one year of relevant working experience. Students completing ACEY or Diploma may be considered. Singaporean only';
    createJobListingFourDto.jobLocation = 'Sembawang, Singapore';
    createJobListingFourDto.averageSalary = 5200;
    createJobListingFourDto.jobStartDate = new Date('2023-12-12');
    createJobListingFourDto.listingDate = new Date('2023-10-15');
    createJobListingFourDto.requiredDocuments =
      'Early Childhood Graduation Cert,Resume';
    createJobListingFourDto.jobListingStatus = JobListingStatusEnum.UNVERIFIED;
    createJobListingFourDto.corporateId = createdCorporateTwo.userId;

    await this.jobListingService.create(createJobListingFourDto);
    console.log(
      `job listing ${createJobListingFourDto.title} is created by corporate username ${createdCorporateTwo.userName}`,
    );

    const createJobListingFiveDto: CreateJobListingDto =
      new CreateJobListingDto();
    createJobListingFiveDto.title = 'Tamil Assistant Teacher';
    createJobListingFiveDto.overview =
      'Looking for a few tamil assistant teachers';
    createJobListingFiveDto.responsibilities =
      'Attends to the basic needs of children from 2 months to 17 months (Infant Care). Teach them Tamil and also ensures children’s safety & well-being while under the centre’s care. Implements centre’s programmes and new initiatives.';
    createJobListingFiveDto.requirements =
      'Fundamentals Certificate in Early Childhood Care and Education (FECCE) is a bonus. At least 1 year of working experience in a related field.';
    createJobListingFiveDto.jobLocation = 'Tengah, Singapore';
    createJobListingFiveDto.averageSalary = 3000;
    createJobListingFiveDto.jobStartDate = new Date('2023-12-12');
    createJobListingFiveDto.listingDate = new Date('2023-10-25');
    createJobListingFiveDto.requiredDocuments =
      'Early Childhood Graduation Cert,Resume,Tamil Language Proficiency Cert,L1 Level Cert,L2 Level Cert';
    createJobListingFiveDto.jobListingStatus = JobListingStatusEnum.APPROVED;
    createJobListingFiveDto.corporateId = createdCorporateTwo.userId;

    await this.jobListingService.create(createJobListingFiveDto);
    console.log(
      `job listing ${createJobListingFiveDto.title} is created by corporate username ${createdCorporateTwo.userName}`,
    );

    const createJobListingSixDto: CreateJobListingDto =
      new CreateJobListingDto();
    createJobListingSixDto.title = 'English Assistant Teacher';
    createJobListingSixDto.overview =
      'Looking for a few english assistant teachers';
    createJobListingSixDto.responsibilities =
      'Attends to the basic needs of children from 2 months to 17 months (Infant Care). Teach them English and also ensures children’s safety & well-being while under the centre’s care. Implements centre’s programmes and new initiatives.';
    createJobListingSixDto.requirements =
      'Fundamentals Certificate in Early Childhood Care and Education (FECCE) is a bonus. At least 1 year of working experience in a related field.';
    createJobListingSixDto.jobLocation = 'Woodland, Singapore';
    createJobListingSixDto.averageSalary = 2800;
    createJobListingSixDto.jobStartDate = new Date('2023-12-12');
    createJobListingSixDto.listingDate = new Date('2023-11-11');
    createJobListingSixDto.requiredDocuments =
      'Early Childhood Graduation Cert,Resume,English Language Proficiency Cert,L1 Level Cert,L2 Level Cert';
    createJobListingSixDto.jobListingStatus = JobListingStatusEnum.APPROVED;
    createJobListingSixDto.corporateId = createdCorporate.userId;

    await this.jobListingService.create(createJobListingSixDto);
    console.log(
      `job listing ${createJobListingSixDto.title} is created by corporate username ${createdCorporate.userName}`,
    );

    // if there's any existing forum categories, don't data init forum categories
    const existingForumCategories = await this.forumCategoryRepository.find();
    if (existingForumCategories.length > 0) {
      return;
    }

    //create forum category
    const createEventsForumCategory: CreateForumCategoryDto =
      new CreateForumCategoryDto();

    createEventsForumCategory.forumCategoryTitle = 'Events';
    createEventsForumCategory.isArchived = false;
    createEventsForumCategory.forumGuidelines = 'This is Events guidelines';

    await this.forumCategoryService.create(createEventsForumCategory);
    console.log(`Events forum category is created.`);

    //create confessions category
    const createConfessionsForumCategory: CreateForumCategoryDto =
      new CreateForumCategoryDto();

    createConfessionsForumCategory.forumCategoryTitle = 'Confessions';
    createConfessionsForumCategory.isArchived = false;
    createConfessionsForumCategory.forumGuidelines =
      'This is Confessions guidelines~This is another Confessions guidelines';

    const confessionsCategory = await this.forumCategoryService.create(
      createConfessionsForumCategory,
    );
    console.log(`Confessions forum category is created.`);

    //create career category
    const createCareerForumCategory: CreateForumCategoryDto =
      new CreateForumCategoryDto();

    createCareerForumCategory.forumCategoryTitle = 'Career';
    createCareerForumCategory.isArchived = false;
    createCareerForumCategory.forumGuidelines = 'This is Career guidelines';

    await this.forumCategoryService.create(createCareerForumCategory);
    console.log(`Career forum category is created.`);

    //create miscellaneous category
    const createMiscellaneousForumCategory: CreateForumCategoryDto =
      new CreateForumCategoryDto();

    createMiscellaneousForumCategory.forumCategoryTitle = 'Miscellaneous';
    createMiscellaneousForumCategory.isArchived = false;
    createMiscellaneousForumCategory.forumGuidelines =
      'This is Miscellaneous guidelines';

    await this.forumCategoryService.create(createMiscellaneousForumCategory);
    console.log(`Miscellaneous forum category is created.`);

    //create others category
    const createOthersForumCategory: CreateForumCategoryDto =
      new CreateForumCategoryDto();

    createOthersForumCategory.forumCategoryTitle = 'Others';
    createOthersForumCategory.isArchived = false;
    createOthersForumCategory.forumGuidelines = 'This is Others guidelines';

    await this.forumCategoryService.create(createOthersForumCategory);
    console.log(`Others forum category is created.`);

    // create active forum post under confessions category by jobseeker@gmail.com
    if (confessionsCategory && existingJobSeeker) {
      await this.forumPostService.create({
        forumPostTitle: 'What the... f',
        createdAt: new Date(),
        forumPostMessage:
          'It has welfare, high pay, and best part of it all, unlimited leaves!',
        isAnonymous: false,
        forumCategoryId: confessionsCategory.forumCategoryId,
        forumPostStatus: ForumPostEnum.Active,
        jobSeekerId: existingJobSeeker.userId,
      });
      console.log(`Active forum post 1 is created.`);
    }

    // create inactive forum post under confessions category by jobseeker@gmail.com
    if (confessionsCategory && existingJobSeeker) {
      await this.forumPostService.create({
        forumPostTitle: 'This company did not give me what I wanted.',
        createdAt: new Date(),
        forumPostMessage: 'The location was just too far...',
        isAnonymous: false,
        forumCategoryId: confessionsCategory.forumCategoryId,
        forumPostStatus: ForumPostEnum.Inactive,
        jobSeekerId: existingJobSeeker.userId,
      });
      console.log(`Inactive forum post 1 is created.`);
    }

    // create pending forum post under confessions category by jobseeker@gmail.com
    if (confessionsCategory && existingJobSeeker) {
      await this.forumPostService.create({
        forumPostTitle: 'I have a confession to make...',
        createdAt: new Date(),
        forumPostMessage:
          'I really love this application. I have always wanted to find such an application. I really love this application. I have always wanted to find such an application. I really love this application. I have always wanted to find such an application. I really love this application. I have always wanted to find such an application.',
        isAnonymous: false,
        forumCategoryId: confessionsCategory.forumCategoryId,
        forumPostStatus: ForumPostEnum.Pending,
        jobSeekerId: existingJobSeeker.userId,
      });
      console.log(`Pending forum post 1 is created.`);
    }

    // create deleted forum post under confessions category by jobseeker@gmail.com
    if (confessionsCategory && existingJobSeeker) {
      await this.forumPostService.create({
        forumPostTitle: 'I take back what I said!',
        createdAt: new Date(),
        forumPostMessage: 'Oopsies.',
        isAnonymous: true,
        forumCategoryId: confessionsCategory.forumCategoryId,
        forumPostStatus: ForumPostEnum.Deleted,
        jobSeekerId: existingJobSeeker.userId,
      });
      console.log(`Deleted forum post is created.`);
    }

    // create reported forum post under confessions category by jobseeker@gmail.com
    if (confessionsCategory && existingJobSeeker) {
      await this.forumPostService.create({
        forumPostTitle: 'c******************',
        createdAt: new Date(),
        forumPostMessage: 'HELLO C*** C*** B** GET YOUR S*** TOGETHER',
        isAnonymous: false,
        forumCategoryId: confessionsCategory.forumCategoryId,
        forumPostStatus: ForumPostEnum.Reported,
        jobSeekerId: existingJobSeeker.userId,
      });
      console.log(`Reported forum post 1 is created.`);
    }

    // create reported forum post under confessions category by jobseeker2@gmail.com
    if (confessionsCategory && existingJobSeekerTwo) {
      await this.forumPostService.create({
        forumPostTitle: 'What a beautiful day!',
        createdAt: new Date(),
        forumPostMessage: 'Wow this is just lovely!',
        isAnonymous: false,
        forumCategoryId: confessionsCategory.forumCategoryId,
        forumPostStatus: ForumPostEnum.Reported,
        jobSeekerId: existingJobSeekerTwo.userId,
      });
      console.log(`Reported forum post 2 is created.`);
    }

    // if there's any existing tickets, don't data init tickets
    const existingTickets = await this.ticketRepository.find();
    if (existingTickets.length > 0) {
      return;
    }

    // ticket 1 creation
    const createTicketOneDto: CreateTicketDto = new CreateTicketDto();
    createTicketOneDto.ticketName = 'Unable to login';
    createTicketOneDto.ticketDescription =
      'I am unable to login even though I am sure that I keyed in the correct credentials';
    createTicketOneDto.isResolved = true;
    createTicketOneDto.email = 'jobseeker@gmail.com';
    createTicketOneDto.ticketCategory = TicketCategoryEnum.ACCOUNT;

    await this.ticketService.create(createTicketOneDto);
    console.log(
      `ticket ${createTicketOneDto.ticketName} is created by email ${createTicketOneDto.email}`,
    );

    // ticket 2 creation
    const createTicketTwoDto: CreateTicketDto = new CreateTicketDto();
    createTicketTwoDto.ticketName = 'Regarding fee charges';
    createTicketTwoDto.ticketDescription =
      'I just want to check what are the all the fees associated if for example I register and successfully find a job through StarHire';
    createTicketTwoDto.isResolved = true;
    createTicketTwoDto.email = 'jobseeker2@gmail.com';
    createTicketTwoDto.ticketCategory = TicketCategoryEnum.SUBSCRIPTION_BILLING;

    await this.ticketService.create(createTicketTwoDto);
    console.log(
      `ticket ${createTicketTwoDto.ticketName} is created by email ${createTicketTwoDto.email}`,
    );

    // ticket 3 creation
    const createTicketThreeDto: CreateTicketDto = new CreateTicketDto();
    createTicketThreeDto.ticketName = 'Landing page';
    createTicketThreeDto.ticketDescription =
      'I am unable to click on anything on the landing page and the whole website just feels very laggy to me';
    createTicketThreeDto.isResolved = true;
    createTicketThreeDto.email = 'jobseeker@gmail.com';
    createTicketThreeDto.ticketCategory = TicketCategoryEnum.GENERAL;

    await this.ticketService.create(createTicketThreeDto);
    console.log(
      `ticket ${createTicketThreeDto.ticketName} is created by email ${createTicketThreeDto.email}`,
    );

    // Job Assignment 1 creation, assign job listing id 6 to jobseeker@gmail.com
    const jobListingSix = await this.jobListingRepository.findOne({
      where: { jobListingId: 6 },
    });

    const response = await this.jobListingService.assignJobListing(
      createdJobSeeker?.userId,
      jobListingSix?.jobListingId,
      createdRecruiter?.userId,
    );
    console.log(response?.message);

    // jobApplication 1 creation - assign job listing id 1 to jobseeker@gmail.com from recruiter@gmail.com
    const jobListingOne = await this.jobListingRepository.findOne({
      where: { jobListingId: 1 },
    });

    const jobAssignmentOneResponse =
      await this.jobListingService.assignJobListing(
        createdJobSeeker?.userId,
        jobListingOne?.jobListingId,
        createdRecruiter?.userId,
      );
    console.log(jobAssignmentOneResponse?.message);

    // const jobListingOne = await this.jobListingRepository.findOne({
    //   where: { jobListingId: 1 },
    // });
    // const jobSeeker = await this.jobSeekerRepository.findOne({
    //   where: { email: 'jobseeker@gmail.com' },
    // });
    // const recruiter = await this.recruiterRepository.findOne({
    //   where: { email: 'recruiter@gmail.com' },
    // });

    // const createJobAssignmentDto: CreateJobAssignmentDto =
    //   new CreateJobAssignmentDto();
    // createJobAssignmentDto.jobSeekerId = jobSeeker.userId;
    // createJobAssignmentDto.jobListingId = jobListingOne.jobListingId;
    // createJobAssignmentDto.recruiterId = recruiter.userId;
    // await this.jobAssignmentService.create(createJobAssignmentDto);
    // console.log('Job assignment one created.');

    const createJobApplicationDto: CreateJobApplicationDto =
      new CreateJobApplicationDto();
    createJobApplicationDto.jobApplicationStatus =
      JobApplicationStatusEnum.OFFER_ACCEPTED;
    createJobApplicationDto.availableStartDate = new Date();
    createJobApplicationDto.remarks = 'This is Job Application 1 used in SR4';
    createJobApplicationDto.submissionDate = new Date();
    createJobApplicationDto.jobListingId = jobListingOne.jobListingId;
    createJobApplicationDto.jobSeekerId = createdJobSeeker.userId;
    createJobApplicationDto.recruiterId = createdRecruiter.userId;
    createJobApplicationDto.documents = null;

    await this.jobApplicationService.create(createJobApplicationDto);
    console.log(`Job Application 1 is created.`);

    // jobApplication 2 creation - assign job listing id 2 to jobseeker2@gmail.com from recruiter@gmail.com
    const jobListingTwo = await this.jobListingRepository.findOne({
      where: { jobListingId: 2 },
    });

    const jobAssignmentTwoResponse =
      await this.jobListingService.assignJobListing(
        createdJobSeekerTwo?.userId,
        jobListingTwo?.jobListingId,
        createdRecruiter?.userId,
      );
    console.log(jobAssignmentTwoResponse?.message);

    // const jobSeekerTwo = await this.jobSeekerRepository.findOne({
    //   where: { email: 'jobseeker2@gmail.com' },
    // });

    // const createJobAssignmentTwoDto: CreateJobAssignmentDto =
    //   new CreateJobAssignmentDto();
    // createJobAssignmentTwoDto.jobSeekerId = jobSeekerTwo.userId;
    // createJobAssignmentTwoDto.jobListingId = jobListingTwo.jobListingId;
    // createJobAssignmentTwoDto.recruiterId = recruiter.userId;
    // await this.jobAssignmentService.create(createJobAssignmentTwoDto);
    // console.log('Job assignment two created.');

    const createJobApplicationTwoDto: CreateJobApplicationDto =
      new CreateJobApplicationDto();
    createJobApplicationTwoDto.jobApplicationStatus =
      JobApplicationStatusEnum.OFFER_ACCEPTED;
    createJobApplicationTwoDto.availableStartDate = new Date();
    createJobApplicationTwoDto.remarks =
      'This is Job Application 2 used in SR4';
    createJobApplicationTwoDto.submissionDate = new Date();
    createJobApplicationTwoDto.jobListingId = jobListingTwo.jobListingId;
    createJobApplicationTwoDto.jobSeekerId = createdJobSeekerTwo.userId;
    createJobApplicationTwoDto.recruiterId = createdRecruiter.userId;
    createJobApplicationTwoDto.documents = null;

    await this.jobApplicationService.create(createJobApplicationTwoDto);
    console.log(`Job Application 2 is created.`);

    // jobApplication 3 creation - assign job listing id 2 to jobseeker3@gmail.com from recruiter@gmail.com
    const jobAssignmentThreeResponse =
      await this.jobListingService.assignJobListing(
        createdJobSeekerThree?.userId,
        jobListingTwo?.jobListingId,
        createdRecruiter?.userId,
      );
    console.log(jobAssignmentThreeResponse?.message);
    // const jobSeekerThree = await this.jobSeekerRepository.findOne({
    //   where: { email: 'jobseeker3@gmail.com' },
    // });

    // const createJobAssignmentThreeDto: CreateJobAssignmentDto =
    //   new CreateJobAssignmentDto();
    // createJobAssignmentThreeDto.jobSeekerId = jobSeekerThree.userId;
    // createJobAssignmentThreeDto.jobListingId = jobListingTwo.jobListingId;
    // createJobAssignmentThreeDto.recruiterId = recruiter.userId;
    // await this.jobAssignmentService.create(createJobAssignmentThreeDto);
    // console.log('Job assignment three created.');

    const createJobApplicationThreeDto: CreateJobApplicationDto =
      new CreateJobApplicationDto();
    createJobApplicationThreeDto.jobApplicationStatus =
      JobApplicationStatusEnum.OFFER_ACCEPTED;
    createJobApplicationThreeDto.availableStartDate = new Date();
    createJobApplicationThreeDto.remarks =
      'This is Job Application 3 used in SR4';
    createJobApplicationThreeDto.submissionDate = new Date();
    createJobApplicationThreeDto.jobListingId = jobListingTwo.jobListingId;
    createJobApplicationThreeDto.jobSeekerId = createdJobSeekerThree.userId;
    createJobApplicationThreeDto.recruiterId = createdRecruiter.userId;
    createJobApplicationThreeDto.documents = null;

    await this.jobApplicationService.create(createJobApplicationThreeDto);
    console.log(`Job Application 3 is created.`);
  }
}
