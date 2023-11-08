import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Administrator } from '../entities/administrator.entity';
import { Corporate } from '../entities/corporate.entity';
import { Invoice } from '../entities/invoice.entity';
import { JobApplication } from '../entities/jobApplication.entity';
import { Repository } from 'typeorm';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { EmailService } from '../email/email.service';
import { TwilioService } from '../twilio/twilio.service';
import NotificationModeEnum from '../enums/notificationMode.enum';
import { PdfService } from '../pdf/pdf.service';
import { UploadService } from '../upload/upload.service';

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
    private emailService: EmailService,
    private twilioService: TwilioService,
    private pdfService: PdfService,
    private uploadService: UploadService,
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
      if (!administrator) {
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

      //Generate the pdf invoice
      // await this.invoiceRepository.save(invoice);
      // const fileName = `invoice${invoice.invoiceId}.pdf`;
      // const pdfBuffer = await this.pdfService.createInvoice(invoice);
      // const s3Link = await this.uploadService.upload(fileName, pdfBuffer);
      // invoice.invoiceLink = s3Link.url;

      // if(corporate.notificationMode === NotificationModeEnum.EMAIL) {
      //   this.emailService.notifyCorporateOfInvoice(corporate,invoice);
      // } else if (corporate.notificationMode === NotificationModeEnum.SMS) {
      //   this.twilioService.notifyCorporateOfInvoice(corporate,invoice);
      // }

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

  async findAllByCorporateId(corporateId: string) {
    try {
      const corporate = await this.corporateRepository.findOne({
        where: { userId: corporateId },
      });
      if (!corporate) {
        throw new NotFoundException('Corporate Id provided is not valid');
      }

      return await this.invoiceRepository.find({
        where: { corporate: corporate },
        relations: {
          administrator: true,
          jobApplications: { jobListing: true, jobSeeker: true },
        },
      });
    } catch (err) {
      throw new HttpException(
        'Failed to find invoices',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: number) {
    try {
      return await this.invoiceRepository.findOne({
        where: { invoiceId: id },
        relations: {
          administrator: true,
          corporate: true,
          jobApplications: { invoice: true },
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
      const invoiceToDelete = await this.findOne(id);
      const jobApplications = invoiceToDelete.jobApplications;
      for (let i = 0; i < jobApplications.length; i++) {
        const jobApplication = jobApplications[i];
        jobApplication.invoice = null;
        await this.jobApplicationRepository.save(jobApplication);
      }
      return await this.invoiceRepository.delete({ invoiceId: id });
    } catch (err) {
      throw new HttpException(
        'Failed to delete Invoice from backend',
        err.message,
        // HttpStatus.BAD_REQUEST,
      );
    }
  }
}
