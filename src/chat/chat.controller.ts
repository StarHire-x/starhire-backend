import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  create(@Body() createChatDto: CreateChatDto) {
    return this.chatService.create(createChatDto);
  }

  @Get(':id')
  findOne(@Param('id') chatId: number) {
    return this.chatService.findChatMessagesByChatId(chatId);
  }

  @Get('/user-chats/:id')
  findUserChats(@Param('id') userId: string) {
    return this.chatService.findUserChats(userId);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.chatService.remove(id);
  }
}
