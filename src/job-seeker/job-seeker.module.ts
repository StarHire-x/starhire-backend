import { Module } from '@nestjs/common';
import { JobSeekerController } from './job-seeker.controller';
import { JobSeekerService } from './job-seeker.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobSeeker } from '../entities/jobSeeker.entity';
import { ForumComment } from '../entities/forumComment.entity';
import { JobApplication } from '../entities/jobApplication.entity';
import { ForumPost } from '../entities/forumPost.entity';
import { Chat } from '../entities/chat.entity';
import { JobPreference } from '../entities/jobPreference.entity';
import { JobExperience } from '../entities/jobExperience.entity';
import { Ticket } from '../entities/ticket.entity';
import { Review } from '../entities/review.entity';
import { JobListing } from '../entities/jobListing.entity';
import { EmailModule } from '../email/email.module';
import { EmailService } from '../email/email.service';
import { APP_GUARD } from '@nestjs/core';
import { TwilioService } from '../twilio/twilio.service';
import { CorporateService } from '../corporate/corporate.service';
import { Corporate } from '../entities/corporate.entity';
import { EventListing } from '../entities/eventListing.entity';
import { EventRegistration } from '../entities/eventRegistration.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      JobSeeker,
      ForumComment,
      JobApplication,
      ForumPost,
      Chat,
      JobPreference,
      JobExperience,
      JobListing,
      Ticket,
      Review,
      JobListing,
      Corporate,
    ]),
  ],
  controllers: [JobSeekerController],
  providers: [JobSeekerService, EmailService, TwilioService],
})
export class JobSeekerModule {}
