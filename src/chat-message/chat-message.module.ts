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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatMessage,
      Chat,
      Recruiter,
      Corporate,
      JobSeeker,
    ]),
  ],
  controllers: [ChatMessageController],
  providers: [ChatMessageService, ChatMessageGateWay],
})
export class ChatMessageModule {}
