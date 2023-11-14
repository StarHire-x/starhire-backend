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
import UserRoleEnum from 'src/enums/userRole.enum';
import { UsersService } from 'src/users/users.service';
import NotificationModeEnum from 'src/enums/notificationMode.enum';
import { EmailService } from 'src/email/email.service';
import { TwilioService } from 'src/twilio/twilio.service';

@Injectable()
export class ChatMessageService {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly chatMessageRepository: Repository<ChatMessage>,

    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,

    private userService: UsersService,
    private emailService: EmailService,
    private twilioService: TwilioService
  ) {}

  async createMessage(
    createChatMessageDto: CreateChatMessageDto,
  ): Promise<any> {
    try {
      // Ensure valid chat Id is provided
      const { chatId, ...dtoExcludingParentId } = createChatMessageDto;

      const chat = await this.chatRepository.findOne({
        where: { chatId: chatId },
        relations: {jobSeeker: true, recruiter: true, corporate: true}
      });
      if (!chat) {
        throw new NotFoundException('Chat Id provided is not valid');
      }

      const chatMessage = new ChatMessage({
        ...dtoExcludingParentId,
        chat,
      });

      await this.chatMessageRepository.save(chatMessage);

      if (!chatMessage.isImportant) {
        return;
      }
      console.log("trigger notificaiton here chat");
      const { userId } = createChatMessageDto;

      const senderUserId = userId; // the sender of this chat message
      var senderUserRole = null;
      var recipientUserId = null; // we will find out who is the recipient
      var recipientUserRole = null;

      var senderUser = null;

      // find out the sender's role
      if (chat?.jobSeeker?.userId && chat?.jobSeeker?.userId === senderUserId) {
        senderUserRole = UserRoleEnum.JOBSEEKER;
      } else if (chat?.recruiter?.userId && chat?.recruiter?.userId === senderUserId) {
        senderUserRole = UserRoleEnum.RECRUITER;
      } else if (chat?.corporate.userId && chat?.corporate.userId === senderUserId) {
        senderUserRole = UserRoleEnum.CORPORATE;
      }

      console.log("sender user id: ");
      console.log(senderUserId);
      console.log("sender user role: ");
      console.log(senderUserRole);

      if (senderUserId && senderUserRole) {
        const senderUserResponse = await this.userService.findByUserId(senderUserId, senderUserRole);
        if (senderUserResponse && senderUserResponse?.data) {
          senderUser = senderUserResponse.data;
        }
      }

      // find out who is the recipient and its role
      if (chat?.jobSeeker?.userId && chat?.jobSeeker?.userId !== senderUserId) {
        recipientUserId = chat?.jobSeeker?.userId;
        recipientUserRole = UserRoleEnum.JOBSEEKER;
      } else if (chat?.recruiter?.userId && chat?.recruiter?.userId !== senderUserId) {
        recipientUserId = chat?.recruiter?.userId;
        recipientUserRole = UserRoleEnum.RECRUITER;
      } else if (chat?.corporate?.userId && chat?.corporate?.userId !== senderUserId) {
        recipientUserId = chat?.corporate?.userId;
        recipientUserRole = UserRoleEnum.CORPORATE;
      }
      console.log("recipient userid:");
      console.log(recipientUserId);
      console.log("recipient role:");
      console.log(recipientUserRole);
      if (recipientUserId && recipientUserRole && senderUser) {
        const recipientUserResponse = await this.userService.findByUserId(recipientUserId, recipientUserRole);
        if (recipientUserResponse && recipientUserResponse?.data) {
          const recipientUser = recipientUserResponse.data;
          // notification logic here, to notify chat recipient
          if (recipientUser.notificationMode === NotificationModeEnum.EMAIL) {
            await this.emailService.notifyChatRecipientImportantMessage(senderUser, recipientUser, chatMessage);
          } else if (recipientUser.notificationMode === NotificationModeEnum.SMS) {
            await this.twilioService.notifyChatRecipientImportantMessage(senderUser, recipientUser, chatMessage);
          }
        }
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    return await this.chatMessageRepository.find();
  }

}
