import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { UpdateChatMessageDto } from './dto/update-chat-message.dto';
import { ChatMessage } from '../entities/chatMessage.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from '../entities/chat.entity';

@Injectable()
export class ChatMessageService {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly chatMessageRepository: Repository<ChatMessage>,

    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
  ) {}

  async createMessage(
    createChatMessageDto: CreateChatMessageDto,
  ): Promise<any> {
    try {
      // Ensure valid chat Id is provided
      const { chatId, ...dtoExcludingParentId } = createChatMessageDto;

      const chat = await this.chatRepository.findOne({
        where: { chatId: chatId },
      });
      if (!chat) {
        throw new NotFoundException('Chat Id provided is not valid');
      }

      const chatMessage = new ChatMessage({
        ...dtoExcludingParentId,
        chat,
      });

      return await this.chatMessageRepository.save(chatMessage);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    return await this.chatMessageRepository.find();
  }

}
