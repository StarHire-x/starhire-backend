import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Administrator } from 'src/entities/administrator.entity';
import { Corporate } from 'src/entities/corporate.entity';
import { Invoice } from 'src/entities/invoice.entity';
import { JobApplication } from 'src/entities/jobApplication.entity';
import { Repository } from 'typeorm';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(Corporate)
    private readonly corporateRepository: Repository<Corporate>,
    @InjectRepository(Administrator)
    private readonly administratorRepository: Repository<Administrator>,
    @InjectRepository(JobApplication)
    private readonly jobApplicationRepository: Repository<JobApplication>,
  ) {}
  async create(createInvoiceDto: CreateInvoiceDto) {
    try {
      const {
        administratorId,
        corporateId,
        jobApplicationIds,
        ...dtoExcludingParentId
      } = createInvoiceDto;

      const corporate = await this.corporateRepository.findOne({
        where: { userId: corporateId },
      });
      if (!corporate) {
        throw new NotFoundException('Corporate Id provided is not valid');
      }

      const administrator = await this.administratorRepository.findOne({
        where: { userId: administratorId },
      });
      if (!corporate) {
        throw new NotFoundException('Administrator Id provided is not valid');
      }

      const jobApplications = [];
      for (let id of jobApplicationIds) {
        const jobApplication = await this.jobApplicationRepository.findOne({
          where: { jobApplicationId: id },
        });
        if (!jobApplication) {
          throw new NotFoundException(
            `Job Application Id ${id} provided is not valid`,
          );
        }
        jobApplications.push(jobApplication);
      }

      const invoice = new Invoice({
        ...dtoExcludingParentId,
        administrator: administrator,
        corporate: corporate,
        jobApplications: jobApplications,
      });
      return await this.invoiceRepository.save(invoice);
    } catch (err) {
      throw new HttpException(
        'Failed to create new invoice',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    return await this.invoiceRepository.find();
  }

  async findOne(id: number) {
    try {
      return await this.invoiceRepository.findOne({
        where: { invoiceId: id },
        relations: {
          administrator: true,
          corporate: true,
          jobApplications: true,
        },
      });
    } catch (err) {
      throw new HttpException('Failed to find invoice', HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    try {
      const invoice = await this.invoiceRepository.findOneBy({
        invoiceId: id,
      });
      if (!invoice) {
        throw new NotFoundException('Invoice Id provided is not valid');
      }
      Object.assign(invoice, updateInvoiceDto);
      return await this.invoiceRepository.save(invoice);
    } catch (err) {
      throw new HttpException(
        'Failed to update Invoice',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: number) {
    try {
      return await this.invoiceRepository.delete({ invoiceId: id });
    } catch (err) {
      throw new HttpException(
        'Failed to delete Invoice',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
