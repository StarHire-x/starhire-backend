import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessage } from 'src/entities/chatMessage.entity';
import { ChatMessageController } from './chatMessage.controller';
import { ChatMessageService } from './chatMessage.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChatMessage])],
  controllers: [ChatMessageController],
  providers: [ChatMessageService],
})
export class ChatMessageModule {}
