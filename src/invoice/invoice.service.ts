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
import { PdfService, TInvoiceData, jobApplication } from '../pdf/pdf.service';
import { UploadService } from '../upload/upload.service';
import InvoiceStatusEnum from '../enums/invoiceStatus.enum';
import Stripe from 'stripe';

@Injectable()
export class InvoiceService {
  private readonly stripe: Stripe;
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
  ) {
    this.stripe = new Stripe(process.env.STRIPE_API_KEY, {
      //@ts-ignore
      apiVersion: '2022-11-15',
    });
  }
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

      const jobApplications: JobApplication[] = [];
      for (let id of jobApplicationIds) {
        const jobApplication = await this.jobApplicationRepository.findOne({
          where: { jobApplicationId: id },
          relations: { jobListing: true, jobSeeker: true },
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

      var stripeCustId = corporate.stripeCustId;

      if (!stripeCustId) {
        const customer = await this.stripe.customers.create({
          email: corporate.email,
          name: corporate.companyName,
          metadata: {
            userId: corporate.userId,
          },
        });

        if (customer) {
          stripeCustId = customer.id;
          corporate.stripeCustId = stripeCustId;

          await this.corporateRepository.save(corporate);
        } else {
          throw new Error('Corporate not found for the given user ID');
        }
      }

      // Create an Invoice
      const stripeInvoice = await this.stripe.invoices.create({
        customer: stripeCustId,
        collection_method: 'send_invoice',
        days_until_due: 14,
        currency: 'sgd',
      });

      // create individual invoice item for each job listing
      for (const jobApp of jobApplications) {
        const invoiceItem = await this.stripe.invoiceItems.create({
          customer: stripeCustId,
          amount: jobApp.jobListing.averageSalary * 100, // because amount takes in cents
          invoice: stripeInvoice.id,
          description: `${jobApp.jobListing.title} - ${jobApp.jobSeeker.userName}`,
          currency: 'sgd',
        });
      }

      // Send the Invoice
      const sentInvoice = await this.stripe.invoices.sendInvoice(
        stripeInvoice.id,
      );

      invoice.stripePaymentLink = sentInvoice.hosted_invoice_url;
      invoice.stripeInvoiceId = sentInvoice.id;

      // Generate the pdf invoice
      // Save invoice to retrieve invoice ID
      const savedInvoice = await this.invoiceRepository.save(invoice);
      const fileName = `invoice${invoice.invoiceId}_${corporate.userName}.pdf`;

      const invoiceJobApplications: jobApplication[] = [];
      jobApplications.forEach((application: JobApplication) => {
        invoiceJobApplications.push({
          jobApplicationId: application?.jobApplicationId,
          jobListingTitle: application?.jobListing?.title,
          amount: application?.jobListing?.averageSalary,
        });
      });

      const invoiceData: TInvoiceData = {
        shipping: {
          name: corporate?.userName,
          address: corporate?.companyAddress,
        },
        items: invoiceJobApplications,
        subtotal: dtoExcludingParentId?.totalAmount,
        paid: 0,
        invoice_nr: savedInvoice?.invoiceId,
      };

      const pdfBuffer = await this.pdfService.createInvoice(invoiceData);
      const s3Link = await this.uploadService.upload(fileName, pdfBuffer);
      invoice.invoiceLink = s3Link.url;

      //Notification
      if (corporate.notificationMode === NotificationModeEnum.EMAIL) {
        this.emailService.notifyCorporateOfInvoice(corporate, invoice);
      } else if (corporate.notificationMode === NotificationModeEnum.SMS) {
        this.twilioService.notifyCorporateOfInvoice(corporate, invoice);
      }

      return await this.invoiceRepository.save(invoice);
    } catch (err) {
      console.log('errata: ' + err);
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
        order: {
          invoiceId: 'ASC',
        },
        where: { corporate: { userId: corporate.userId } },
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

  async updateInvoiceStatusForStripePayment(stripeInvoiceId: string) {
    try {
      const invoice = await this.invoiceRepository.findOneBy({
        stripeInvoiceId: stripeInvoiceId,
      });

      if (!invoice) {
        throw new NotFoundException('Invoice Id provided is not valid');
      }

      invoice.invoiceStatus = InvoiceStatusEnum.INDICATED_PAID;
      return await this.invoiceRepository.save(invoice);
    } catch (err) {
      throw new HttpException(
        'Failed to update Invoice for stripe payment',
        HttpStatus.BAD_REQUEST,
      );
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

  async invoicePayment(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    try {
      const invoice = await this.invoiceRepository.findOne({
        where: { invoiceId: id },
        relations: {
          administrator: true,
          corporate: true,
          jobApplications: { jobListing: true },
        },
      });
      if (!invoice) {
        throw new NotFoundException('Invoice Id provided is not valid');
      }

      // update invoice payment to pay in full
      const invoiceJobApplications: jobApplication[] = [];
      invoice.jobApplications?.forEach((application) =>
        invoiceJobApplications.push({
          jobApplicationId: application.jobApplicationId,
          jobListingTitle: application.jobListing?.title,
          amount: application.jobListing?.averageSalary,
        }),
      );

      const invoiceData: TInvoiceData = {
        shipping: {
          name: invoice.corporate?.companyName,
          address: invoice.corporate?.companyAddress,
        },
        items: invoiceJobApplications,
        subtotal: invoice.totalAmount,
        paid: invoice.totalAmount, // should be paid in full
        invoice_nr: invoice.invoiceId,
      };
      const invoicePdfBuffer = await this.pdfService.createInvoice(invoiceData);
      const pdfLink = await this.uploadService.upload(
        `invoice${invoice.invoiceId}_${invoice?.corporate?.companyName}.pdf`,
        invoicePdfBuffer,
      );

      updateInvoiceDto = { ...updateInvoiceDto, invoiceLink: pdfLink?.url };

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

  async getAllCorporateInvoices() {
    try {
      const allCorporate = await this.corporateRepository.find({
        relations: { invoices: true },
      });

      const allInvoices = await this.invoiceRepository.find({
        relations: { corporate: true },
      });

      const overallStatistics = {
        notPaidSum: 0,
        notPaidCount: 0,
        indicatedPaidSum: 0,
        indicatedPaidCount: 0,
        confirmedPaidSum: 0,
        confirmedPaidCount: 0,
      };

      const formattedResponse = await Promise.all(
        allCorporate.map((corporate) => {
          const invoices = corporate.invoices;

          const statistics = {
            notPaidSum: 0,
            notPaidCount: 0,
            indicatedPaidSum: 0,
            indicatedPaidCount: 0,
            confirmedPaidSum: 0,
            confirmedPaidCount: 0,
          };

          const formattedInvoice = invoices.map((invoice) => {
            if (invoice.invoiceStatus === InvoiceStatusEnum.NOT_PAID) {
              statistics.notPaidCount += 1;
              statistics.notPaidSum += invoice.totalAmount;
            } else if (
              invoice.invoiceStatus === InvoiceStatusEnum.INDICATED_PAID
            ) {
              statistics.indicatedPaidCount += 1;
              statistics.indicatedPaidSum += invoice.totalAmount;
            } else if (
              invoice.invoiceStatus === InvoiceStatusEnum.CONFIRMED_PAID
            ) {
              statistics.confirmedPaidCount += 1;
              statistics.confirmedPaidSum += invoice.totalAmount;
            }
            return {
              invoiceId: invoice.invoiceId,
              invoiceDate: invoice.invoiceDate,
              invoiceStatus: invoice.invoiceStatus,
              dueDate: invoice.dueDate,
              billingAddress: invoice.billingAddress,
              totalAmount: invoice.totalAmount,
              invoiceLink: invoice.invoiceLink,
              corporateId: corporate.userId,
              companyName: corporate.companyName,
              profilePictureUrl: corporate.profilePictureUrl,
            };
          });

          overallStatistics.notPaidSum += statistics.notPaidSum;
          overallStatistics.notPaidCount += statistics.notPaidCount;
          overallStatistics.indicatedPaidCount += statistics.indicatedPaidCount;
          overallStatistics.indicatedPaidSum += statistics.indicatedPaidSum;
          overallStatistics.confirmedPaidCount += statistics.confirmedPaidCount;
          overallStatistics.confirmedPaidSum += statistics.confirmedPaidSum;

          return {
            corporateId: corporate.userId,
            companyName: corporate.companyName,
            invoices: formattedInvoice,
            statistics,
          };
        }),
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Invoice statistics retrieved',
        data: {
          overallStatistics: overallStatistics,
          formattedResponse: formattedResponse,
        },
      };
    } catch (err) {
      throw new HttpException('Error in Database', HttpStatus.BAD_REQUEST);
    }
  }

  private obtainDateByDayWeeksMonth() {
    const startDate = new Date('2023-08-27');
    const today = new Date();

    // Array for days
    const dateArrayInDays = [];
    let currentDate = new Date(startDate);
    while (currentDate <= today) {
      const day = currentDate.getDate().toString().padStart(2, '0');
      const month = currentDate
        .toLocaleString('en-us', { month: 'short' })
        .toUpperCase();
      const year = currentDate.getFullYear().toString().slice(-2);
      dateArrayInDays.push(`${day}-${month}-${year}`);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Array for weeks
    const dateArrayByWeek = [];
    currentDate = new Date(startDate);
    while (currentDate <= today) {
      const startDay = currentDate.getDate().toString().padStart(2, '0');
      const startMonth = currentDate
        .toLocaleString('en-us', { month: 'short' })
        .toUpperCase();
      const startYear = currentDate.getFullYear().toString().slice(-2);

      // Calculate the end date of the week
      let endDate = new Date(currentDate);
      endDate.setDate(endDate.getDate() + 6);
      if (endDate > today) {
        endDate = today;
      }

      const endDay = endDate.getDate().toString().padStart(2, '0');
      const endMonth = endDate
        .toLocaleString('en-us', { month: 'short' })
        .toUpperCase();
      const endYear = endDate.getFullYear().toString().slice(-2);

      // Add the week to the array
      dateArrayByWeek.push(
        `${startDay}-${startMonth}-${startYear} to ${endDay}-${endMonth}-${endYear}`,
      );

      // Increment the date
      currentDate.setDate(currentDate.getDate() + 7);
    }

    // Array for months
    const dateArrayInMonths = [];
    currentDate = new Date(startDate);
    while (currentDate <= today) {
      const month = currentDate
        .toLocaleString('en-us', { month: 'short' })
        .toUpperCase();
      const year = currentDate.getFullYear().toString().slice(-2);
      const monthYear = `${month}-${year}`;
      if (!dateArrayInMonths.includes(monthYear)) {
        dateArrayInMonths.push(monthYear);
      }
      currentDate.setDate(1); // Set to the 1st to prevent rollover
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return {
      dateArrayInDays,
      dateArrayByWeek,
      dateArrayInMonths,
    };
  }

  private formatDateByMonth(isoString) {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const date = new Date(isoString);
    const month = months[date.getMonth()].toUpperCase();
    const year = date.getFullYear().toString().slice(-2);
    return `${month}-${year}`;
  }

  private formatDateByDay(isoString) {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const date = new Date(isoString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()].toUpperCase();
    const year = date.getFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;
  }

  private formatDateByWeek(isoString, reference) {
    const targetDate = new Date(isoString);

    for (let range of reference) {
      const [start, end] = range.split(' to ');
      const startDate = this.parseDate(start);
      const endDate = this.parseDate(end);

      if (targetDate >= startDate && targetDate <= endDate) {
        return range;
      }
    }

    return 'Date out of range';
  }

  private parseDate(dateString) {
    const [day, month, year] = dateString.split('-');
    const months = {
      JAN: 0,
      FEB: 1,
      MAR: 2,
      APR: 3,
      MAY: 4,
      JUN: 5,
      JUL: 6,
      AUG: 7,
      SEP: 8,
      OCT: 9,
      NOV: 10,
      DEC: 11,
    };
    return new Date(
      global.Number(`20${year}`),
      months[month],
      global.Number(day),
    );
  }

  async getOneCorporateInvoices(userId: string) {
    try {
      const corporate = await this.corporateRepository.findOne({
        where: { userId: userId },
        relations: ['invoices'],
      });

      const statisticsMetrics = {
        notPaidSum: 0,
        notPaidCount: 0,
        indicatedPaidSum: 0,
        indicatedPaidCount: 0,
        confirmedPaidSum: 0,
        confirmedPaidCount: 0,
      };

      let statistics = {
        Not_Paid: {},
        Indicated_Paid: {},
        Confirmed_Paid: {},
      };

      const result = this.obtainDateByDayWeeksMonth();
      const month = result.dateArrayInMonths;
      const day = result.dateArrayInDays;
      const weeks = result.dateArrayByWeek;

      for(const invoice of corporate.invoices) {

        const monthSum = this.formatDateByMonth(invoice.invoiceDate);
        const daySum = this.formatDateByDay(invoice.invoiceDate);
        const weekSum = this.formatDateByWeek(invoice.invoiceDate, weeks);

        const status = invoice.invoiceStatus;

        if (invoice.invoiceStatus === InvoiceStatusEnum.NOT_PAID) {
          statisticsMetrics.notPaidCount += 1;
          statisticsMetrics.notPaidSum += invoice.totalAmount;
        } else if (invoice.invoiceStatus === InvoiceStatusEnum.INDICATED_PAID) {
          statisticsMetrics.indicatedPaidCount += 1;
          statisticsMetrics.indicatedPaidSum += invoice.totalAmount;
        } else if (invoice.invoiceStatus === InvoiceStatusEnum.CONFIRMED_PAID) {
          statisticsMetrics.confirmedPaidCount += 1;
          statisticsMetrics.confirmedPaidSum += invoice.totalAmount;
        }

        statistics[status][monthSum] = (statistics[status][monthSum] || 0) + invoice.totalAmount;
        statistics[status][daySum] =
          (statistics[status][daySum] || 0) + invoice.totalAmount;
          statistics[status][weekSum] =
            (statistics[status][weekSum] || 0) + invoice.totalAmount;
      }

      const overallStatistics = {
        overall: statisticsMetrics,
        month: {
          label: month,
          dataNotPaid: month.map(
            (label: string) => statistics.Not_Paid[label] || 0,
          ),
          dataIndicatedPaid: month.map(
            (label: string) => statistics.Indicated_Paid[label] || 0,
          ),
          dataConfirmedPaid: month.map(
            (label: string) => statistics.Confirmed_Paid[label] || 0,
          ),
        },
        day: {
          label: day,
          dataNotPaid: day.map(
            (label: string) => statistics.Not_Paid[label] || 0,
          ),
          dataIndicatedPaid: day.map(
            (label: string) => statistics.Indicated_Paid[label] || 0,
          ),
          dataConfirmedPaid: day.map(
            (label: string) => statistics.Confirmed_Paid[label] || 0,
          ),
        },
        week: {
          label: weeks,
          dataNotPaid: weeks.map(
            (label: string) => statistics.Not_Paid[label] || 0,
          ),
          dataIndicatedPaid: weeks.map(
            (label: string) => statistics.Indicated_Paid[label] || 0,
          ),
          dataConfirmedPaid: weeks.map(
            (label: string) => statistics.Confirmed_Paid[label] || 0,
          ),
        },
      };

      return {
        statusCode: HttpStatus.OK,
        message: 'Invocie detailed statistics retrieved',
        data: overallStatistics,
      };
    } catch (err) {
      throw new HttpException('Error in Database', HttpStatus.BAD_REQUEST);
    }
  }
}
