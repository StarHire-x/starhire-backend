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
}
