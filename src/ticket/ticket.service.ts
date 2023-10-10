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
import { Ticket } from 'src/entities/ticket.entity';
import { Administrator } from 'src/entities/administrator.entity';
import { Recruiter } from 'src/entities/recruiter.entity';
import { Corporate } from 'src/entities/corporate.entity';
import { JobSeeker } from 'src/entities/jobSeeker.entity';
import { mapTicketCategoryToEnum } from 'src/common/mapStringToEnum';

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
  ) {}

  async create(createTicketDto: CreateTicketDto) {
    try {
      const {
        recruiterId,
        corporateId,
        jobSeekerId,
        adminId,
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
      if (!recruiter && !corporate && !jobSeeker) {
        throw new NotFoundException('Normal User Ids provided is not valid');
      }

      const ticket = new Ticket({
        ...ticketWithoutParentId,
        administrator,
        recruiter,
        corporate,
        jobSeeker,
      });

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
    return await this.ticketRepository.find();
  }

  async findOne(id: number) {
    try {
      // For this part, we want the relationship with other entities to show, at most 1 level, no need to be too detail
      return await this.ticketRepository.findOne({
        where: { ticketId: id },
        relations: {
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
}
