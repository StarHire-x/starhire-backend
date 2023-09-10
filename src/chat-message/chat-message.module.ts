import { Module } from '@nestjs/common';
import { ChatMessageService } from './chat-message.service';
import { ChatMessageController } from './chat-message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessage } from 'src/entities/chatMessage.entity';
import { Chat } from 'src/entities/chat.entity';
import { ChatMessageGateWay } from './chat-message.gateway';
import { Recruiter } from 'src/entities/recruiter.entity';
import { Corporate } from 'src/entities/corporate.entity';
import { JobSeeker } from 'src/entities/jobSeeker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatMessage, Chat, Recruiter, Corporate, JobSeeker])],
  controllers: [ChatMessageController],
  providers: [ChatMessageService, ChatMessageGateWay],
})
export class ChatMessageModule {}
