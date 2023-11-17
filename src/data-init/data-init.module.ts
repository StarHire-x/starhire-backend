import { Module } from '@nestjs/common';
import { AdministratorService } from '../administrator/admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Administrator } from '../entities/administrator.entity';
import { Corporate } from '../entities/corporate.entity';
import { JobListing } from '../entities/jobListing.entity';
import { RecruiterService } from '../recruiter/recruiter.service';
import { CorporateService } from '../corporate/corporate.service';
import { JobSeekerService } from '../job-seeker/job-seeker.service';
import { JobSeeker } from '../entities/jobSeeker.entity';
import { Recruiter } from '../entities/recruiter.entity';
import { DataInitService } from './data-init.service';
import { JobListingService } from '../job-listing/job-listing.service';
import { JobAssignment } from '../entities/jobAssignment.entity';
import { EmailModule } from '../email/email.module';
import { TwilioModule } from '../twilio/twilio.module';
import { ForumCategory } from '../entities/forumCategory.entity';
import { ForumCategoriesService } from '../forum-categories/forum-categories.service';
import { ForumPostsService } from '../forum-posts/forum-posts.service';
import { ForumPost } from '../entities/forumPost.entity';
import { JobApplication } from '../entities/jobApplication.entity';
import { Ticket } from '../entities/ticket.entity';
import { TicketService } from '../ticket/ticket.service';
import { Document } from '../entities/document.entity';
import { DocumentService } from '../document/document.service';
import { JobPreference } from '../entities/jobPreference.entity';
import { JobPreferenceService } from '../job-preference/job-preference.service';
import { CommissionRate } from '../entities/commissionRate.entity';
import { CommissionRateService } from '../commission-rate/commission-rate.service';
import { JobApplicationService } from 'src/job-application/job-application.service';
import { JobAssignmentService } from 'src/job-assignment/job-assignment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Administrator,
      Recruiter,
      Corporate,
      JobSeeker,
      JobListing,
      JobAssignment,
      JobApplication,
      ForumCategory,
      ForumPost,
      Ticket,
      Document,
      JobPreference,
      CommissionRate,
      JobApplication,
      JobAssignment,
    ]),
    EmailModule,
    TwilioModule,
  ],
  controllers: [],
  providers: [
    DataInitService,
    AdministratorService,
    RecruiterService,
    CorporateService,
    JobSeekerService,
    JobListingService,
    ForumCategoriesService,
    ForumPostsService,
    TicketService,
    DocumentService,
    JobPreferenceService,
    CommissionRateService,
    JobApplicationService,
    JobAssignmentService,
  ],
})
export class DataInitModule {}
