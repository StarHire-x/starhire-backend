import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';
import UserRoleEnum from '../enums/userRole.enum';
import { JobApplication } from '../entities/jobApplication.entity';
import { JobListing } from '../entities/jobListing.entity';
import { JobSeeker } from '../entities/jobSeeker.entity';
import { Recruiter } from '../entities/recruiter.entity';
import { Corporate } from '../entities/corporate.entity';
import { Administrator } from '../entities/administrator.entity';
import { Ticket } from '../entities/ticket.entity';
import { EventListing } from '../entities/eventListing.entity';
import { Invoice } from '../entities/invoice.entity';
import { User } from 'src/entities/user.entity';
import { ChatMessage } from 'src/entities/chatMessage.entity';

@Injectable()
export class TwilioService {
  private readonly client: twilio.Twilio;

  constructor(private configService: ConfigService) {
    this.client = new twilio.Twilio(
      configService.get<string>('TWILIO_ACCOUNT_SID'),
      configService.get<string>('TWILIO_AUTH_TOKEN'),
    );
  }

  async notifyCorporateOnJobListingStatus(
    corporate: Corporate,
    jobListing: JobListing,
  ) {
    let loginLink = 'http://www.localhost:3001/login';

    if (!corporate.contactNo) {
      return;
    }

    const message = `Hello ${corporate.companyName},
Your status on Job Listing ID: ${jobListing.jobListingId}, ${
      jobListing.title
    } have been updated to: ${jobListing.jobListingStatus.toUpperCase()}.
Log in to view the changes: ${loginLink}`;

    try {
      //to refers to the whatsapp number , body refer to message
      await this.client.messages.create({
        to: `whatsapp:+65${corporate.contactNo}`,
        from: this.configService.get<string>('TWILIO_PHONE_NUMBER'),
        body: message,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'SMS successfully sent',
        data: corporate,
      };
    } catch (error) {
      throw new HttpException('Failed to send SMS', HttpStatus.BAD_REQUEST);
    }
  }

  async notifyRecruiterOnNewJobListing(
    recruiter: Recruiter,
    corporate: Corporate,
    jobListing: JobListing,
  ) {
    let loginLink = 'http://www.localhost:3000/login';

    if (!recruiter.contactNo) {
      return;
    }

    const message = `Hello ${recruiter.fullName},
We want to inform you that a new Job Listing ID: ${jobListing.jobListingId}, ${jobListing.title} by ${corporate.companyName} has been approved
Log in to perform job matching: ${loginLink}`;

    try {
      //to refers to the whatsapp number , body refer to message
      await this.client.messages.create({
        to: `whatsapp:+65${recruiter.contactNo}`,
        from: this.configService.get<string>('TWILIO_PHONE_NUMBER'),
        body: message,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'SMS successfully sent',
        data: corporate,
      };
    } catch (error) {
      throw new HttpException('Failed to send SMS', HttpStatus.BAD_REQUEST);
    }
  }

  // notify admin when there is new job listing so they can do approval
  async notifyAdminOnNewJobListing(
    admin: Administrator,
    corporate: Corporate,
    jobListing: JobListing,
  ) {
    let loginLink = 'http://www.localhost:3000/login';

    if (!admin.contactNo) {
      return;
    }

    const message = `Hello ${admin.fullName},
Please vet new Job Listing ID: ${jobListing.jobListingId}, ${jobListing.title} by ${corporate.companyName}`;

    try {
      await this.client.messages.create({
        to: `whatsapp:+65${admin.contactNo}`,
        from: this.configService.get<string>('TWILIO_PHONE_NUMBER'),
        body: message,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'SMS successfully sent',
        data: corporate,
      };
    } catch (error) {
      throw new HttpException('Failed to send SMS', HttpStatus.BAD_REQUEST);
    }
  }

  // Support the 4 different users
  async sendNotificationStatusSMS(user: any, role: string) {
    let loginLink = 'http://www.localhost:3001/login';
    if (
      role === UserRoleEnum.RECRUITER ||
      role === UserRoleEnum.ADMINISTRATOR
    ) {
      loginLink = 'http://www.localhost:3000/login';
    }

    if (!user.contactNo) {
      return;
    }

    const message = `Hello ${user.fullName},
Your notification settings have been updated to: ${user.notificationMode}.
Log in to view the changes: ${loginLink}`;

    try {
      //to refers to the whatsapp number , body refer to message
      await this.client.messages.create({
        to: `whatsapp:+65${user.contactNo}`,
        from: this.configService.get<string>('TWILIO_PHONE_NUMBER'),
        body: message,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'SMS successfully sent',
        data: user,
      };
    } catch (error) {
      throw new HttpException('Failed to send SMS', HttpStatus.BAD_REQUEST);
    }
  }

  async notifyTicketResolution(user: any, ticket: Ticket) {
    let loginLink = 'http://www.localhost:3001/login';

    if (!user.contactNo) {
      return;
    }

    const message = `Hello ${user.userName},
Administrator has resolved your ticket with the title ${ticket.ticketName} of the category 
${ticket.ticketCategory} with the description ${ticket.ticketDescription}
Log in to view the changes: ${loginLink}`;

    try {
      //to refers to the whatsapp number , body refer to message
      await this.client.messages.create({
        to: `whatsapp:+65${user.contactNo}`,
        from: this.configService.get<string>('TWILIO_PHONE_NUMBER'),
        body: message,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'SMS successfully sent',
        data: user,
      };
    } catch (error) {
      throw new HttpException('Failed to send SMS', HttpStatus.BAD_REQUEST);
    }
  }

  async notifyJobSeekerOnApplicationStatus(
    jobSeeker: JobSeeker,
    jobApplication: JobApplication,
    jobListing: JobListing,
    corporate: Corporate,
    recruiter: Recruiter,
  ) {
    let loginLink = 'http://www.localhost:3001/login';

    if (!jobSeeker.contactNo) {
      return;
    }

    const message = `Dear ${jobSeeker.fullName},
Your job application status for ${jobListing.title} at ${
      corporate.companyName
    } handled by recruiter ${
      recruiter.fullName
    } is now ${jobApplication.jobApplicationStatus.toUpperCase()}.
Log in for details: ${loginLink}`;

    try {
      await this.client.messages.create({
        to: `whatsapp:+65${jobSeeker.contactNo}`,
        from: this.configService.get<string>('TWILIO_PHONE_NUMBER'),
        body: message,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'SMS successfully sent',
        data: jobSeeker,
      };
    } catch (error) {
      throw new HttpException('Failed to send SMS', HttpStatus.BAD_REQUEST);
    }
  }

  async notifyRecruiterOnApplicationStatus(
    recruiter: Recruiter,
    jobSeeker: JobSeeker,
    jobApplication: JobApplication,
    jobListing: JobListing,
    corporate: Corporate,
  ) {
    let loginLink = 'http://www.localhost:3000/login';

    if (!recruiter.contactNo) {
      return;
    }

    const message = `Hi ${recruiter.userName},
The job application status of ${jobSeeker.fullName} for ${
      jobListing.title
    } at ${
      corporate.companyName
    } is now ${jobApplication.jobApplicationStatus.toUpperCase()}.
Log in for details: ${loginLink}`;

    try {
      await this.client.messages.create({
        to: `whatsapp:+65${recruiter.contactNo}`,
        from: this.configService.get<string>('TWILIO_PHONE_NUMBER'),
        body: message,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'SMS successfully sent',
        data: recruiter,
      };
    } catch (error) {
      throw new HttpException('Failed to send SMS', HttpStatus.BAD_REQUEST);
    }
  }

  async notifyCorporateOnApplicationStatus(
    corporate: Corporate,
    jobSeeker: JobSeeker,
    jobApplication: JobApplication,
    jobListing: JobListing,
    recruiter: Recruiter,
  ) {
    let loginLink = 'http://www.localhost:3001/login';

    if (!corporate.contactNo) {
      return;
    }

    const message = `Hi ${corporate.companyName},
The job application status of ${jobSeeker.fullName} for ${
      jobListing.title
    } handled by recruiter ${
      recruiter.fullName
    } is now ${jobApplication.jobApplicationStatus.toUpperCase()}.
Log in for details: ${loginLink}`;

    try {
      await this.client.messages.create({
        to: `whatsapp:+65${corporate.contactNo}`,
        from: this.configService.get<string>('TWILIO_PHONE_NUMBER'),
        body: message,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'SMS successfully sent',
        data: corporate,
      };
    } catch (error) {
      throw new HttpException('Failed to send SMS', HttpStatus.BAD_REQUEST);
    }
  }

  async notifyCorporateOnNewApplication(
    corporate: Corporate,
    jobSeeker: JobSeeker,
    jobApplication: JobApplication,
    jobListing: JobListing,
    recruiter: Recruiter,
  ) {
    let loginLink = 'http://www.localhost:3001/login';

    if (!corporate.contactNo) {
      return;
    }

    const message = `Hi ${corporate.companyName},
There is a new job application by ${jobSeeker.fullName} for ${jobListing.title} that is forwarded by recruiter ${recruiter.fullName} 
Log in for details: ${loginLink}`;

    try {
      await this.client.messages.create({
        to: `whatsapp:+65${corporate.contactNo}`,
        from: this.configService.get<string>('TWILIO_PHONE_NUMBER'),
        body: message,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'SMS successfully sent',
        data: corporate,
      };
    } catch (error) {
      throw new HttpException('Failed to send SMS', HttpStatus.BAD_REQUEST);
    }
  }

  async notifyJobSeekerOnMatchedJobListing(
    jobSeeker: JobSeeker,
    jobListing: JobListing,
    recruiter: Recruiter,
  ) {
    let loginLink = 'http://www.localhost:3001/login';

    if (!jobSeeker.contactNo) {
      return;
    }

    const message = `Hi ${jobSeeker.fullName},
You have been matched by recruiter ${recruiter.fullName} for the role of ${jobListing.title}
Log in for details: ${loginLink}`;

    try {
      await this.client.messages.create({
        to: `whatsapp:+65${jobSeeker.contactNo}`,
        from: this.configService.get<string>('TWILIO_PHONE_NUMBER'),
        body: message,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'SMS successfully sent',
        data: jobSeeker,
      };
    } catch (error) {
      throw new HttpException('Failed to send SMS', HttpStatus.BAD_REQUEST);
    }
  }

  async notifyCorporateOfInvoice(
    corporate: Corporate,
    invoice: Invoice,
  ) {
    let loginLink = 'http://www.localhost:3001/login';

    if (!corporate.contactNo) {
      return;
    }

    const message = `Hi ${corporate.companyName},
We want to inform you about an incoming invoice of invoice ID: ${invoice.invoiceId} that would be issued shortly 
Log in for details: ${loginLink}`;

    try {
      await this.client.messages.create({
        to: `whatsapp:+65${corporate.contactNo}`,
        from: this.configService.get<string>('TWILIO_PHONE_NUMBER'),
        body: message,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'SMS successfully sent',
        data: corporate,
      };
    } catch (error) {
      throw new HttpException('Failed to send SMS', HttpStatus.BAD_REQUEST);
    }
  }

  async notifyJobSeekerNewEvent(
    corporate: Corporate,
    eventListing: EventListing,
    jobSeeker: JobSeeker,
  ) {
    let loginLink = 'http://www.localhost:3001/login';

    if (!jobSeeker.contactNo) {
      return;
    }

    const message = `Hi ${jobSeeker.fullName},
There is a new event ${eventListing.eventName} happening at ${eventListing.location} has been posted by ${corporate.companyName}
Log in for details: ${loginLink}`;

    try {
      await this.client.messages.create({
        to: `whatsapp:+65${jobSeeker.contactNo}`,
        from: this.configService.get<string>('TWILIO_PHONE_NUMBER'),
        body: message,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'SMS successfully sent',
        data: jobSeeker,
      };
    } catch (error) {
      throw new HttpException('Failed to send SMS', HttpStatus.BAD_REQUEST);
    }
  }

  async notifyChatRecipientImportantMessage(
    sender: User,
    recipient: User,
    chatMessage: ChatMessage,
  ) {
    let loginLink = 'http://www.localhost:3001/login';

    if (!recipient.contactNo) {
      return;
    }

    const message = `Hi ${recipient.userName}, you have an important message sent by ${sender.userName}. Message content: ${chatMessage.message}. Login for details: ${loginLink}}`;

    try {
      await this.client.messages.create({
        to: `whatsapp:+65${recipient.contactNo}`,
        from: this.configService.get<string>('TWILIO_PHONE_NUMBER'),
        body: message,
      });

      console.log("SMS whatsapp sent");

      return {
        statusCode: HttpStatus.OK,
        message: 'SMS successfully sent',
        data: recipient,
      };
    } catch (error) {
      throw new HttpException('Failed to send SMS', HttpStatus.BAD_REQUEST);
    }
  
  }
}
