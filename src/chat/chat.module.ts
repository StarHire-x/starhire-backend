import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from 'src/entities/chat.entity';
import { Recruiter } from 'src/entities/recruiter.entity';
import { JobSeeker } from 'src/entities/jobSeeker.entity';
import { Corporate } from 'src/entities/corporate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Recruiter, JobSeeker, Corporate])],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
