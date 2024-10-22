import {
  Injectable,
  HttpException,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from '../entities/chat.entity';
import { Repository } from 'typeorm';
import { Corporate } from '../entities/corporate.entity';
import { Recruiter } from '../entities/recruiter.entity';
import { JobSeeker } from '../entities/jobSeeker.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(Corporate)
    private readonly corporateRepository: Repository<Corporate>,
    @InjectRepository(Recruiter)
    private readonly recruiterRepository: Repository<Recruiter>,
    @InjectRepository(JobSeeker)
    private readonly jobSeekerRepository: Repository<JobSeeker>,
  ) {}

  async create(createChatDto: CreateChatDto): Promise<Chat> {
    try {
      const { corporateId, jobSeekerId, recruiterId, ...dtoExcludingParentId } =
        createChatDto;

      // 1st Combination for a chat to happen - Recruiter & Corporate
      if (corporateId != null && recruiterId != null) {
        const corporate = await this.corporateRepository.findOne({
          where: { userId: corporateId },
        });

        const recruiter = await this.recruiterRepository.findOne({
          where: { userId: recruiterId },
        });

        const chatFound = await this.chatRepository.findOne({
          where: {
            corporate: { userId: corporateId },
            recruiter: { userId: recruiterId },
          },
        });

        if (chatFound) {
          throw new NotFoundException('Chat already exists');
        }

        if (!corporate || !recruiter) {
          throw new NotFoundException('Id provided is not valid');
        }

        if (!corporate || !recruiter) {
          throw new NotFoundException('Id provided is not valid');
        }
        const chat = new Chat({
          ...dtoExcludingParentId,
          corporate,
          recruiter,
        });
        return await this.chatRepository.save(chat);

        // 2nd Combination for a chat to happen  - Job Seeker & Recruiter
      } else if (jobSeekerId != null && recruiterId != null) {
        const jobSeeker = await this.jobSeekerRepository.findOne({
          where: { userId: jobSeekerId },
        });

        const recruiter = await this.recruiterRepository.findOne({
          where: { userId: recruiterId },
        });

        const chatFound = await this.chatRepository.findOne({
          where: {
            jobSeeker: { userId: jobSeekerId },
            recruiter: { userId: recruiterId },
          },
        });

        if (chatFound) {
          throw new NotFoundException('Chat already exists');
        }

        if (!jobSeeker || !recruiter) {
          throw new NotFoundException('Id provided is not valid');
        }

        const chat = new Chat({
          ...dtoExcludingParentId,
          jobSeeker,
          recruiter,
        });
        return await this.chatRepository.save(chat);
      } else {
        throw new NotFoundException('Id provided not sufficient');
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findUserChats(userId: string) {
    try {
      const allChats = await this.chatRepository.find({
        where: [
          {
            recruiter: { userId: userId },
          },
          {
            jobSeeker: { userId: userId },
          },
          {
            corporate: { userId: userId },
          },
        ],
        // relations: {
        //   chatMessages: false,
        // },
      });
      return allChats;
    } catch (error) {
      throw new HttpException(
        'Failed to delete chat message',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findChatMessagesByChatId(chatId: number) {
    try {
      const currentChat = await this.chatRepository.findOne({
        where: {
          chatId: chatId,
        },
        relations: {
          chatMessages: true,
        },
      });
      return currentChat;
    } catch (error) {
      throw new HttpException(
        'Failed to get chat messages by chat Id',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: number) {
    try {
      return await this.chatRepository.delete({
        chatId: id,
      });
    } catch (error) {
      throw new HttpException(
        'Failed to delete chat message',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
