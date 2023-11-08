import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from '../entities/chat.entity';
import { Recruiter } from '../entities/recruiter.entity';
import { JobSeeker } from '../entities/jobSeeker.entity';
import { Corporate } from '../entities/corporate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Recruiter, JobSeeker, Corporate])],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
