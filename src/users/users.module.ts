import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { JobSeekerService } from '../job-seeker/job-seeker.service';
import { RecruiterService } from '../recruiter/recruiter.service';
import { CorporateService } from '../corporate/corporate.service';
import { AdministratorService } from '../administrator/admin.service';
import { JobSeeker } from '../entities/jobSeeker.entity';
import { Recruiter } from '../entities/recruiter.entity';
import { Corporate } from '../entities/corporate.entity';
import { Administrator } from '../entities/administrator.entity';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { EmailModule } from '../email/email.module';
import { TwilioModule } from '../twilio/twilio.module';
import { JobListing } from '../entities/jobListing.entity';
import { JobAssignment } from '../entities/jobAssignment.entity';
import { JobApplication } from '../entities/jobApplication.entity';

require('dotenv').config();

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      JobSeeker,
      Recruiter,
      Corporate,
      Administrator,
      JobListing,
      JobAssignment,
      JobApplication,
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30 days' }, // user with backend access token is valid for 30 days to call our Backend API routes, to sync with NextAuth's Frontend default 30 days of session
    }),
    EmailModule,
    TwilioModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    JobSeekerService,
    RecruiterService,
    CorporateService,
    AdministratorService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class UsersModule {}
