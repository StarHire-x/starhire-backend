import { Module } from '@nestjs/common';
import { JobSeekerController } from './job-seeker.controller';
import { JobSeekerService } from './job-seeker.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobSeeker } from 'src/entities/jobSeeker.entity';
import { ForumComment } from 'src/entities/forumComment.entity';
import { JobApplication } from 'src/entities/jobApplication.entity';
import { ForumPost } from 'src/entities/forumPost.entity';
import { Chat } from 'src/entities/chat.entity';
import { JobPreference } from 'src/entities/jobPreference.entity';
import { JobExperience } from 'src/entities/jobExperience.entity';
import { Ticket } from 'src/entities/ticket.entity';
import { Review } from 'src/entities/review.entity';
import { JobListing } from 'src/entities/jobListing.entity';
import { EmailModule } from 'src/email/email.module';
import { EmailService } from 'src/email/email.service';
import { APP_GUARD } from '@nestjs/core';
import { TwilioService } from 'src/twilio/twilio.service';
import { CorporateService } from 'src/corporate/corporate.service';
import { Corporate } from 'src/entities/corporate.entity';
import { EventListing } from 'src/entities/eventListing.entity';

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
