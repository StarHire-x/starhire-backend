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
      Ticket,
      Review,
      JobListing,
    ]),
  ],
  controllers: [JobSeekerController],
  providers: [JobSeekerService],
})
export class JobSeekerModule {}
