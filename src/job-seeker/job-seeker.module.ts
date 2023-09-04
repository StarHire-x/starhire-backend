import { Module } from '@nestjs/common';
import { JobSeekerController } from './job-seeker.controller';
import { JobSeekerService } from './job-seeker.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobSeeker } from 'src/entities/jobSeeker.entity';
import { ForumComment } from 'src/entities/forumComment.entity';
import { JobPreference } from 'src/entities/jobPreference.entity';
import { JobApplication } from 'src/entities/jobApplication.entity';
import { ForumPost } from 'src/entities/forumPost.entity';
import { Chat } from 'src/entities/chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobSeeker, ForumComment, JobPreference, JobApplication, ForumPost, Chat])],
  controllers: [JobSeekerController],
  providers: [JobSeekerService]
})
export class JobSeekerModule {}
