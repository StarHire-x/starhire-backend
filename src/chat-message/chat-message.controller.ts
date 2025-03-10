import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Render,
  Res,
} from '@nestjs/common';
import { ChatMessageService } from './chat-message.service';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { UpdateChatMessageDto } from './dto/update-chat-message.dto';

@Controller('chat-message')
export class ChatMessageController {
  constructor(private readonly chatMessageService: ChatMessageService) {}

  @Post()
  create(@Body() createChatMessageDto: CreateChatMessageDto) {
    return this.chatMessageService.createMessage(createChatMessageDto);
  }

  @Get('/chat')
  @Render('index')
  Home() {
    return;
  }

  @Get('/api/chat')
 async Chat(@Res() res) {
   const messages = await this.chatMessageService.findAll();
   res.json(messages);
 }

  @Get()
  findAll() {
    return this.chatMessageService.findAll();
  }
}
