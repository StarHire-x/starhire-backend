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

    // Job Seeker account creation
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

    const createdJobSeeker = await this.jobSeekerRepository.findOne({
      where: {
        userName: createJobSeekerDto.userName,
        email: createJobSeekerDto.email,
      },
    });

    // if any of the accounts not valid, don't proceed data init
    if (
      !createdAdmin ||
      !createdRecruiter ||
      !createdCorporate ||
      !createdCorporateTwo ||
      !createdJobSeeker
    ) {
      return;
    }

    // job listing 1 creation
    const createJobListingDto: CreateJobListingDto = new CreateJobListingDto();
    createJobListingDto.title = 'Nursery Teacher';
    createJobListingDto.overview = 'Looking for a nursery teacher.';
    createJobListingDto.responsibilities = 'Manage nursery classes.';
    createJobListingDto.requirements = 'NIE';
    createJobListingDto.jobLocation = 'Kent Ridge, Singapore';
    createJobListingDto.averageSalary = 5000;
    createJobListingDto.jobStartDate = new Date('2023-10-29');
    createJobListingDto.requiredDocuments =
      'Education Certs, Resume, Cover Letter';
    createJobListingDto.jobListingStatus = JobListingStatusEnum.UNVERIFIED;
    createJobListingDto.corporateId = createdCorporate.userId;

    const existingJobListingOne = await this.jobListingRepository.findOne({
      where: {
        title: createJobListingDto.title,
        overview: createJobListingDto.overview,
        responsibilities: createJobListingDto.responsibilities,
        requirements: createJobListingDto.requirements,
        jobLocation: createJobListingDto.jobLocation,
        averageSalary: createJobListingDto.averageSalary,
        jobStartDate: createJobListingDto.jobStartDate,
        requiredDocuments: createJobListingDto.requiredDocuments,
        corporate: createdCorporate,
      },
    });

    if (!existingJobListingOne) {
      await this.jobListingService.create(createJobListingDto);
      console.log(
        `job listing ${createJobListingDto.title} is created by corporate username ${createdCorporate.userName}`,
      );
    }

    // job listing 2 creation
    const createJobListingTwoDto: CreateJobListingDto =
      new CreateJobListingDto();
    createJobListingTwoDto.title = 'Kindergarten Teacher';
    createJobListingTwoDto.overview = 'Looking for a Kindergarten teacher.';
    createJobListingTwoDto.responsibilities = 'Manage kindergarten classes.';
    createJobListingTwoDto.requirements = 'NIE';
    createJobListingTwoDto.jobLocation = 'Woodlands, Singapore';
    createJobListingTwoDto.averageSalary = 7500;
    createJobListingTwoDto.jobStartDate = new Date('2023-11-25');
    createJobListingTwoDto.requiredDocuments =
      'Education Certs, Resume, Cover Letter';
    createJobListingTwoDto.jobListingStatus = JobListingStatusEnum.UNVERIFIED;
    createJobListingTwoDto.corporateId = createdCorporate.userId;

    const existingJobListingTwo = await this.jobListingRepository.findOne({
      where: {
        title: createJobListingTwoDto.title,
        overview: createJobListingTwoDto.overview,
        responsibilities: createJobListingTwoDto.responsibilities,
        requirements: createJobListingTwoDto.requirements,
        jobLocation: createJobListingTwoDto.jobLocation,
        averageSalary: createJobListingTwoDto.averageSalary,
        jobStartDate: createJobListingTwoDto.jobStartDate,
        requiredDocuments: createJobListingTwoDto.requiredDocuments,
        corporate: createdCorporate,
      },
    });

    if (!existingJobListingTwo) {
      await this.jobListingService.create(createJobListingTwoDto);
      console.log(
        `job listing ${createJobListingTwoDto.title} is created by corporate username ${createdCorporate.userName}`,
      );
    }
  }
}
