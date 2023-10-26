import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Administrator } from 'src/entities/administrator.entity';
import UserRoleEnum from 'src/enums/userRole.enum';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateAdministratorDto } from '../administrator/dto/create-admin.dto';
import { AdministratorService } from '../administrator/admin.service';
import { Recruiter } from 'src/entities/recruiter.entity';
import { RecruiterService } from 'src/recruiter/recruiter.service';
import { Corporate } from 'src/entities/corporate.entity';
import { CorporateService } from 'src/corporate/corporate.service';
import { JobSeeker } from 'src/entities/jobSeeker.entity';
import { JobSeekerService } from 'src/job-seeker/job-seeker.service';
import { CreateRecruiterDto } from 'src/recruiter/dto/create-recruiter.dto';
import { CreateCorporateDto } from 'src/corporate/dto/create-corporate.dto';
import { CreateJobSeekerDto } from 'src/job-seeker/dto/create-job-seeker.dto';
import { JobListing } from 'src/entities/jobListing.entity';
import { JobListingService } from 'src/job-listing/job-listing.service';
import { CreateJobListingDto } from 'src/job-listing/dto/create-job-listing.dto';
import JobListingStatusEnum from 'src/enums/jobListingStatus.enum';
import { ForumCategory } from 'src/entities/forumCategory.entity';
import { ForumCategoriesService } from 'src/forum-categories/forum-categories.service';
import { CreateForumCategoryDto } from 'src/forum-categories/dto/create-forum-category.dto';
import { Ticket } from 'src/entities/ticket.entity';
import { TicketService } from 'src/ticket/ticket.service';
import { CreateTicketDto } from 'src/ticket/dto/create-ticket.dto';
import TicketCategoryEnum from 'src/enums/ticketCategory.enum';
import { JobPreference } from 'src/entities/jobPreference.entity';
import { JobPreferenceService } from 'src/job-preference/job-preference.service';
import { CreateJobPreferenceDto } from 'src/job-preference/dto/create-job-preference.dto';

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
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    private readonly ticketService: TicketService,
    @InjectRepository(JobPreference)
    private readonly jobPreferenceRepository: Repository<JobPreference>,
    private readonly jobPreferenceService: JobPreferenceService,
  ) {}

  async onModuleInit() {
    await this.initializeData();
  }

  async initializeData() {
    // Admin account creation
    const hashedAdminPassword = await bcrypt.hash(process.env.ADMIN_PW, 5);
    const createAdministratorDto: CreateAdministratorDto =
      new CreateAdministratorDto();
    createAdministratorDto.userName = 'admin';
    createAdministratorDto.password = hashedAdminPassword;
    createAdministratorDto.email = 'admin@gmail.com';
    createAdministratorDto.contactNo = '05854749';
    createAdministratorDto.role = UserRoleEnum.ADMINISTRATOR;
    createAdministratorDto.createdAt = new Date();
    createAdministratorDto.fullName = 'Administrator'
    createAdministratorDto.profilePictureUrl =
      'https://starhire-uploader.s3.ap-southeast-2.amazonaws.com/BRYANLEONG_PHOTO.png';

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
    createRecruiterDto.createdAt = new Date();
    createRecruiterDto.profilePictureUrl =
      'https://starhire-uploader.s3.ap-southeast-2.amazonaws.com/lia.jpeg';
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
    createCorporateDto.createdAt = new Date();
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
    createCorporateTwoDto.createdAt = new Date();
    createCorporateTwoDto.companyRegistrationId = 177452074;
    createCorporateTwoDto.profilePictureUrl =
      'https://starhire-uploader.s3.ap-southeast-2.amazonaws.com/Scenery+8.jpg';
    createCorporateDto.companyName = 'Pawfect Pte Ltd';

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
    createCorporateThreeDto.createdAt = new Date();
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
    createJobSeekerDto.createdAt = new Date();
    createJobSeekerDto.fullName = 'Jane Tan';
    createJobSeekerDto.profilePictureUrl =
      'https://starhire-uploader.s3.ap-southeast-2.amazonaws.com/yeji.jpg';

    const existingJobSeeker = await this.jobSeekerRepository.findOne({
      where: {
        userName: createJobSeekerDto.userName,
        email: createJobSeekerDto.email,
      },
    });

    // if data init job seeker does not exist, means we can create the data init job seeker
    if (!existingJobSeeker) {
      await this.jobSeekerService.create(createJobSeekerDto);
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
    createJobSeekerTwoDto.createdAt = new Date();
    createJobSeekerTwoDto.fullName = 'Karen Tan';
    createJobSeekerTwoDto.profilePictureUrl =
      'https://starhire-uploader.s3.ap-southeast-2.amazonaws.com/chaeryeon.jpg';

    const existingJobSeekerTwo = await this.jobSeekerRepository.findOne({
      where: {
        userName: createJobSeekerTwoDto.userName,
        email: createJobSeekerTwoDto.email,
      },
    });

    // if data init job seeker does not exist, means we can create the data init job seeker
    if (!existingJobSeekerTwo) {
      await this.jobSeekerService.create(createJobSeekerTwoDto);
      console.log(
        `Data initialized this job seeker account ${createJobSeekerTwoDto.email} successfully!`,
      );
    }

    // at here, all 4 types of accounts will be valid, use them to link up with other entities
    const createdAdmin = await this.administratorRepository.findOne({
      where: {
        userName: createAdministratorDto.userName,
        email: createAdministratorDto.email,
      },
    });

    const createdRecruiter = await this.recruiterRepository.findOne({
      where: {
        userName: createRecruiterDto.userName,
        email: createRecruiterDto.email,
      },
    });

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

    // if any of the accounts not valid, don't proceed data init
    if (
      !createdAdmin ||
      !createdRecruiter ||
      !createdCorporate ||
      !createdCorporateTwo ||
      !createdCorporateThree ||
      !createdJobSeeker ||
      !createdJobSeekerTwo
    ) {
      return;
    }

    // if there's any existing job preference, don't data init job preferences;
    const existingJobPreference = await this.jobPreferenceRepository.find();
    if (existingJobPreference.length > 0) {
      return;
    }

    // jobPreference 1 creation
    const createJobPreferenceDto: CreateJobPreferenceDto = new CreateJobPreferenceDto();
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
    createJobListingDto.jobStartDate = new Date('2024-10-09');
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
    createJobListingTwoDto.jobStartDate = new Date('2024-10-16');
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
    createJobListingThreeDto.jobStartDate = new Date('2024-10-23');
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
    createJobListingFourDto.jobStartDate = new Date('2024-10-30');
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
    createJobListingFiveDto.jobStartDate = new Date('2024-10-23');
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
    createJobListingSixDto.jobStartDate = new Date('2024-10-23');
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
      'This is Confessions guidelines';

    await this.forumCategoryService.create(createConfessionsForumCategory);
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
  }
}
