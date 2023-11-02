import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QueryFailedError, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from '../entities/ticket.entity';
import { Administrator } from '../entities/administrator.entity';
import { Recruiter } from '../entities/recruiter.entity';
import { Corporate } from '../entities/corporate.entity';
import { JobSeeker } from '../entities/jobSeeker.entity';
import { Document } from '../entities/document.entity';
import { mapTicketCategoryToEnum } from '../common/mapStringToEnum';
import { EmailService } from '../email/email.service';
import { TwilioService } from '../twilio/twilio.service';
import NotificationModeEnum from '../enums/notificationMode.enum';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    // Parent entities
    @InjectRepository(Administrator)
    private readonly adminRepository: Repository<Administrator>,
    @InjectRepository(Recruiter)
    private readonly recruiterRepository: Repository<Recruiter>,
    @InjectRepository(Corporate)
    private readonly corporateRepository: Repository<Corporate>,
    @InjectRepository(JobSeeker)
    private readonly jobSeekerRepository: Repository<JobSeeker>,
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    private emailService: EmailService,
    private twilioService: TwilioService,
  ) {}

  async create(createTicketDto: CreateTicketDto) {
    try {
      const {
        recruiterId,
        corporateId,
        jobSeekerId,
        adminId,
        documents,
        ...ticketWithoutParentId
      } = createTicketDto;

      const administrator =
        adminId &&
        (await this.adminRepository.findOne({
          where: { userId: adminId },
        }));

      const recruiter =
        recruiterId &&
        (await this.recruiterRepository.findOne({
          where: { userId: recruiterId },
        }));

      const corporate =
        corporateId &&
        (await this.corporateRepository.findOne({
          where: { userId: corporateId },
        }));

      const jobSeeker =
        jobSeekerId &&
        (await this.jobSeekerRepository.findOne({
          where: { userId: jobSeekerId },
        }));

      // Ensure 1 of the 3 normal type users is provided
      // Admin ID can be null upon ticket creation until an Admin picks up the ticket
      /*
      if (!recruiter && !corporate && !jobSeeker) {
        throw new NotFoundException('Normal User Ids provided is not valid');
      }
      */

      const ticket = new Ticket({
        ...ticketWithoutParentId,
        administrator,
        recruiter,
        corporate,
        jobSeeker,
      });

      if (documents && documents.length > 0) {
        const updatedDocuments = documents.map((createDocumentDto) => {
          return new Document(createDocumentDto);
        });
        ticket.documents = updatedDocuments;
      }

      console.log(ticket);

      await this.ticketRepository.save(ticket);

      if (ticket.ticketCategory) {
        ticket.ticketCategory = mapTicketCategoryToEnum(ticket.ticketCategory);
      }

      await this.ticketRepository.save(ticket);
      return {
        statusCode: HttpStatus.OK,
        message: 'Ticket successfully created',
        data: ticket,
      };
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Failed to create new ticket',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    try {
      return await this.ticketRepository.find({
        relations: {
          corporate: true,
          recruiter: true,
          administrator: true,
          jobSeeker: true,
          documents: true,
        },
      });
    } catch (error) {
      throw new HttpException('Failed to find ticket', HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number) {
    try {
      // For this part, we want the relationship with other entities to show, at most 1 level, no need to be too detail
      return await this.ticketRepository.findOne({
        where: { ticketId: id },
        relations: {
          documents: true,
          corporate: true,
          recruiter: true,
          administrator: true,
          jobSeeker: true,
        },
      });
    } catch (error) {
      throw new HttpException('Failed to find ticket', HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, updatedTicketDto: UpdateTicketDto) {
    try {
      const ticket = await this.ticketRepository.findOneBy({
        ticketId: id,
      });

      if (!ticket) {
        throw new NotFoundException('Ticket Id provided is not valid');
      }

      if (updatedTicketDto.ticketCategory) {
        updatedTicketDto.ticketCategory = mapTicketCategoryToEnum(
          updatedTicketDto.ticketCategory,
        );
      }

      // Handle condition when admin picks up an ticket
      const administrator =
        updatedTicketDto.adminId &&
        (await this.adminRepository.findOne({
          where: { userId: updatedTicketDto.adminId },
        }));

      if (administrator) {
        updatedTicketDto.adminId = administrator.userId;
      }

      Object.assign(ticket, updatedTicketDto);
      return await this.ticketRepository.save(ticket);
    } catch (error) {
      throw new HttpException(
        'Failed to update ticket',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: number) {
    try {
      return await this.ticketRepository.delete({
        ticketId: id,
      });
    } catch (error) {
      throw new HttpException(
        'Failed to delete ticket',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async resolveTicket(id: number): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({
      where: { ticketId: id },
      relations: { jobSeeker: true, corporate: true, recruiter: true }
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    ticket.isResolved = true;

    if(ticket.jobSeeker) {
      if(ticket.jobSeeker.notificationMode === NotificationModeEnum.EMAIL) {
        this.emailService.notifyTicketResolution(ticket.jobSeeker, ticket);
      } else if(ticket.jobSeeker.notificationMode === NotificationModeEnum.SMS) {
        this.twilioService.notifyTicketResolution(ticket.jobSeeker, ticket);
      }
    } else if (ticket.corporate) {
      if (ticket.corporate.notificationMode === NotificationModeEnum.EMAIL) {
        this.emailService.notifyTicketResolution(ticket.corporate, ticket);
      } else if (ticket.corporate.notificationMode === NotificationModeEnum.SMS) {
        this.twilioService.notifyTicketResolution(ticket.corporate, ticket);
      }
    } else if (ticket.recruiter) {
      if (ticket.recruiter.notificationMode === NotificationModeEnum.EMAIL) {
        this.emailService.notifyTicketResolution(ticket.recruiter, ticket);
      } else if (ticket.recruiter.notificationMode === NotificationModeEnum.SMS) {
        this.twilioService.notifyTicketResolution(ticket.recruiter, ticket);
      }
    }
    
    return await this.ticketRepository.save(ticket);
  }
}
