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

    const message = `Hi ${corporate.schoolName},
    Your Job Listing ID: ${jobListing.jobListingId}, ${
      jobListing.title
    } have been: ${jobListing.jobListingStatus.toUpperCase()}.
    Log in to follow up: ${loginLink}`;

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

    const message = `Hi ${recruiter.fullName},
    A new job listing, ${jobListing.title} created by ${corporate.schoolName} has been approved!
    You can login to start matching this job listing to suitable job seekers. ${loginLink}`;

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
    if (!admin.contactNo) {
      return;
    }

    const message = `Hi ${admin.fullName},
    A new job listing ${jobListing.title}, with ID ${jobListing.jobListingId}, has been created by ${corporate.schoolName}!
    Log in to vet job listing.`;

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

    const message = `Hi ${user.fullName},
    This is to confirm that you have changed your notification mode to ${user.notificationMode}.
    Log in to see the changes: ${loginLink}
    If you did not make this change, send in a ticket immediately and our Administrator will contact you.`;

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

    const message = `Hi ${user.userName},
  Our Administrator has resolved the ticket ${ticket.ticketName} of the category 
  ${ticket.ticketCategory} that you sent in.
  Log in to see the changes: ${loginLink}
  If you still encounter difficulties, do send in another ticket and our Administrator will contact you.`;

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

    const message = `Hi ${jobSeeker.firstName},
    Your job application status for the position of ${jobListing.title} at ${
      corporate.schoolName
    } has been updated.
    The current status of your job application is: ${jobApplication.jobApplicationStatus.toUpperCase()}.
    Log in to follow up: ${loginLink}
    For further enquiries, do contact recruiter ${
      recruiter.fullName
    } who is handling your job application.`;

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
    The job application status of ${jobSeeker.firstName} for the position of ${
      jobListing.title
    } at ${
      corporate.schoolName
    } has been updated. The current status of the job application is: ${jobApplication.jobApplicationStatus.toUpperCase()}.
    Log in to follow up: ${loginLink}`;

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

    const message = `Hi ${corporate.schoolName},
    The job application status of ${jobSeeker.firstName} for the position of ${
      jobListing.title
    } has been updated. 
    The current status of the job application is: ${jobApplication.jobApplicationStatus.toUpperCase()}.
    Log in to follow up: ${loginLink}
    For further enquiries, do contact recruiter ${
      recruiter.fullName
    } who is handling this job application.`;

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

    const message = `Hi ${corporate.schoolName},
    A job seeker, ${jobSeeker.firstName} applied for the position of ${jobListing.title}.
    Log in to follow up: ${loginLink}
    For further enquiries, do contact recruiter ${recruiter.fullName} who is handling this job application.`;

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

    const message = `Hi ${jobSeeker.firstName},
    Congratulations! You have a new job ${jobListing.title} matched to you.
    Log in to check it out and start applying! ${loginLink}
    For further enquiries, do contact recruiter ${recruiter.fullName}.`;

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

  async notifyCorporateOfInvoice(corporate: Corporate, invoice: Invoice) {
    let loginLink = 'http://www.localhost:3001/login';

    if (!corporate.contactNo) {
      return;
    }

    const message = `Hi ${corporate.schoolName},
    This is to inform you about an incoming invoice that would be issued shortly.
    The Invoice ID is: ${invoice.invoiceId}.
    Log in to check: ${loginLink}
    For further enquiries, do send in a ticket and our Administrator will contact you.`;

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

    const message = `Hi ${jobSeeker.firstName},
    A new event ${eventListing.eventName} happening at ${eventListing.location} has been posted by ${corporate.schoolName}!
    Log in to check it out: ${loginLink}`;

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

    //     const message = `Hi ${recipient.userName},
    // You have an important message from ${sender.userName}.
    // Message: ${chatMessage.message}
    // Log in for details: ${loginLink}`;

    const message = `Hi ${recipient.userName},
You have an important message from ${sender.userName}.

Message: \"${chatMessage.message}\"

Regards, StarHire

Log in for details: ${loginLink}`;

    try {
      await this.client.messages.create({
        to: `whatsapp:+65${recipient.contactNo}`,
        from: this.configService.get<string>('TWILIO_PHONE_NUMBER'),
        body: message,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'SMS successfully sent',
        data: recipient,
      };
    } catch (error) {
      throw new HttpException('Failed to send SMS', HttpStatus.BAD_REQUEST);
    }
  }

  async notifyJobSeekerCancelledEvent(
    eventListing: EventListing,
    jobSeeker: JobSeeker,
  ) {
    if (!jobSeeker.contactNo) {
      return;
    }

    const message = `Hi ${jobSeeker.firstName},
    Please take note that the event ${eventListing.eventName} happening at ${eventListing.location} has been cancelled.
`;

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
}
