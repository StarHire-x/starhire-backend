import { Module } from '@nestjs/common';
import { ChatMessageService } from './chat-message.service';
import { ChatMessageController } from './chat-message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessage } from '../entities/chatMessage.entity';
import { Chat } from '../entities/chat.entity';
import { ChatMessageGateWay } from './chat-message.gateway';
import { Recruiter } from '../entities/recruiter.entity';
import { Corporate } from '../entities/corporate.entity';
import { JobSeeker } from '../entities/jobSeeker.entity';
import { UsersService } from 'src/users/users.service';
import { EmailService } from 'src/email/email.service';
import { TwilioService } from 'src/twilio/twilio.service';
import { Administrator } from 'src/entities/administrator.entity';
import { JobSeekerService } from 'src/job-seeker/job-seeker.service';
import { CorporateService } from 'src/corporate/corporate.service';
import { RecruiterService } from 'src/recruiter/recruiter.service';
import { AdministratorService } from 'src/administrator/admin.service';
import { JobListing } from 'src/entities/jobListing.entity';
import { JobApplication } from 'src/entities/jobApplication.entity';
import { JobAssignment } from 'src/entities/jobAssignment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatMessage,
      Chat,
      Recruiter,
      Corporate,
      JobSeeker,
      Administrator,
      JobListing,
      JobApplication,
      JobAssignment
    ]),
  ],
  controllers: [ChatMessageController],
  providers: [ChatMessageService, ChatMessageGateWay, UsersService, EmailService, TwilioService, JobSeekerService, CorporateService, RecruiterService, AdministratorService],
})
export class ChatMessageModule {}
