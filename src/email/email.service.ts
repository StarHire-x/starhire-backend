import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateEmailDto } from './dto/create-email.dto';

import { JobListingService } from '../job-listing/job-listing.service';
import UserRoleEnum from '../enums/userRole.enum';
import { JobSeeker } from '../entities/jobSeeker.entity';
import { JobApplication } from '../entities/jobApplication.entity';
import { JobListing } from '../entities/jobListing.entity';
import { Corporate } from '../entities/corporate.entity';
import { Recruiter } from '../entities/recruiter.entity';
import { Administrator } from '../entities/administrator.entity';
import { Ticket } from '../entities/ticket.entity';
import { Invoice } from '../entities/invoice.entity';
import { EventListing } from '../entities/eventListing.entity';
import { User } from 'src/entities/user.entity';
import { ChatMessage } from 'src/entities/chatMessage.entity';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService, // We should not be calling other service classes to avoid cyclic dependency
  ) // private readonly jobListingService: JobListingService,
  {}

  async resetPassword(createEmailDto: CreateEmailDto) {
    try {
      await this.mailerService.sendMail({
        to: createEmailDto.emailAddress,
        subject: 'Reset Password',
        html: `This is the Token id: ${createEmailDto.tokenId}`,
      });

      return {
        statusCode: 200,
        message:
          'Token id is send to your email, you have 1 hour to activate it',
        data: createEmailDto,
      };
    } catch (err) {
      throw new HttpException(
        'Failed to send reset password email',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // inform corporate on job listing status
  async notifyCorporateOnJobListingStatus(
    corporate: Corporate,
    jobListing: JobListing,
  ) {
    let loginLink = 'http://www.localhost:3001/login';

    try {
      await this.mailerService.sendMail({
        to: corporate.email,
        subject: `Status Update on Job Listing ID: ${jobListing.jobListingId}, ${jobListing.title}`,
        html: `Dear <Strong>${corporate.userName}</Strong>,<br><br>
               We want to inform you about the status of your job listing.<br>

               Your Job Listing ID: <strong>${
                 jobListing.jobListingId
               }</strong>, <strong>${jobListing.title}</strong><br><br>
               has been <strong>${jobListing.jobListingStatus.toUpperCase()}</strong> <br><br>

               Please <a href="http://www.localhost:3001/login">Login</a> to your account to see the changes <br><br>

               For further enquiries please contact our Admin support staff <br><br>
               Thank you for using our service!<br><br>
               Best regards,<br>
               StarHire`,
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'Notification status email sent successfully',
        data: corporate,
      };
    } catch (err) {
      throw new HttpException(
        'Failed to send Notification status email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async notifyRecruiterOnNewJobListing(
    recruiter: Recruiter,
    corporate: Corporate,
    jobListing: JobListing,
  ) {
    try {
      await this.mailerService.sendMail({
        to: recruiter.email,
        subject: `New Job Listing ID: ${jobListing.jobListingId}, ${jobListing.title}`,
        html: `Dear <Strong>${recruiter.fullName}</Strong>,<br><br>
               We want to inform you that a new Job Listing ID: ${jobListing.jobListingId}, ${jobListing.title} by ${corporate.companyName} has been approved<br>

               Please <a href="http://www.localhost:3000/login">Login</a> to your account to perform job matching <br><br>

               Thank you for using our service!<br><br>
               Best regards,<br>
               StarHire`,
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'Notification sent successfully',
        data: recruiter,
      };
    } catch (err) {
      throw new HttpException(
        'Failed to send Notification',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // notify admin when there is new job listing so they can do approval
  async notifyAdminOnNewJobListing(
    admin: Administrator,
    corporate: Corporate,
    jobListing: JobListing,
  ) {
    try {
      await this.mailerService.sendMail({
        to: admin.email,
        subject: `New Job Listing ID: ${jobListing.jobListingId}, ${jobListing.title}`,
        html: `Dear <Strong>${admin.fullName}</Strong>,<br><br>
               Please vet this Job Listing ID: ${jobListing.jobListingId}, ${jobListing.title} by ${corporate.companyName}<br>

               Thank you for using our service!<br><br>
               Best regards,<br>
               StarHire`,
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'Notification sent successfully',
        data: admin,
      };
    } catch (err) {
      throw new HttpException(
        'Failed to send Notification',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Supports the 4 different users
  async sendNotificationStatusEmail(user: any, role: string) {
    let loginLink = 'http://www.localhost:3001/login';
    if (
      role === UserRoleEnum.RECRUITER ||
      role === UserRoleEnum.ADMINISTRATOR
    ) {
      loginLink = 'http://www.localhost:3000/login';
    }

    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: `Status Update for User: ${user.fullName}`,
        html: `Dear <Strong>${user.fullName}</Strong> with a role of <Strong>${user.role}</Strong>,<br><br>
             You have changed your notification settings to ${user.notificationMode}<br>

             Please <a href="${loginLink}">Login</a> to your account to see the changes <br><br>

             For further enquiries, please contact our Admin support staff <br><br>
             Thank you for using our service!<br><br>
             Best regards,<br>
             StarHire`,
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'Notification status email sent successfully',
        data: user,
      };
    } catch (err) {
      throw new HttpException(
        'Failed to send Notification status email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async notifyTicketResolution(user: any, ticket: Ticket) {
    let loginLink = 'http://www.localhost:3001/login';

    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: `Ticket Status ${ticket.ticketId} Update for User: ${user.userName}`,
        html: `Dear <Strong>${user.userName}</Strong>,<br><br>
             Administrator has resolved your ticket with the title ${ticket.ticketName} of the category 
             ${ticket.ticketCategory} with the description ${ticket.ticketDescription}<br>

             Please <a href="${loginLink}">Login</a> to your account to see the changes <br><br>

             For further enquiries, please contact our Admin support staff <br><br>
             Thank you for using our service!<br><br>
             Best regards,<br>
             StarHire`,
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'Notification status email sent successfully',
        data: user,
      };
    } catch (err) {
      throw new HttpException(
        'Failed to send Notification status email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // inform job seeker of job application status - havent add to method yet
  async notifyJobSeekerOnApplicationStatus(
    jobSeeker: JobSeeker,
    jobApplication: JobApplication,
    jobListing: JobListing,
    corporate: Corporate,
    recruiter: Recruiter,
  ) {
    let loginLink = 'http://www.localhost:3001/login';

    try {
      await this.mailerService.sendMail({
        to: jobSeeker.email,
        subject: `Job Application ID: ${jobApplication.jobApplicationId} Status Update for ${jobSeeker.fullName}`,
        html: `Dear <strong>${jobSeeker.fullName}</strong>,<br><br>
         
         We want to inform you that your job application status for the position of ${jobListing.title} at ${corporate.companyName} that is handled by recruiter ${recruiter.fullName} has been updated. Your current status is: <strong>${jobApplication.jobApplicationStatus}</strong>.<br><br>

         Kindly <a href="${loginLink}">log in</a> to your account to view the details.<br><br>

         Should you have any further questions, please don't hesitate to contact our administrative support team.<br><br>

         Thank you for choosing StarHire.<br><br>
         
         Warm regards,<br>
         The StarHire Team`,
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'Notification status email sent successfully',
        data: jobSeeker,
      };
    } catch (err) {
      throw new HttpException(
        'Failed to send Notification status email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // notify recruiter on job application status
  async notifyRecruiterOnApplicationStatus(
    recruiter: Recruiter,
    jobSeeker: JobSeeker,
    jobApplication: JobApplication,
    jobListing: JobListing,
    corporate: Corporate,
  ) {
    let loginLink = 'http://www.localhost:3000/login';

    try {
      await this.mailerService.sendMail({
        to: recruiter.email,
        subject: `Job Application ID: ${jobApplication.jobApplicationId} Status Update for ${jobSeeker.fullName}`,
        html: `Dear <strong>${recruiter.fullName}</strong>,<br><br>
         
         We want to inform you that the job application status of ${jobSeeker.fullName} for the position of ${jobListing.title} at ${corporate.companyName} has been updated. Their current status is: <strong>${jobApplication.jobApplicationStatus}</strong>.<br><br>

         Kindly <a href="${loginLink}">log in</a> to your account for the next course of action.<br><br>
         
         Warm regards,<br>
         The StarHire Team`,
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'Notification status email sent successfully',
        data: jobSeeker,
      };
    } catch (err) {
      throw new HttpException(
        'Failed to send Notification status email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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

    try {
      await this.mailerService.sendMail({
        to: corporate.email,
        subject: `Job Application ID: ${jobApplication.jobApplicationId} Status Update for ${jobSeeker.fullName}`,
        html: `Dear <strong>${corporate.companyName}</strong>,<br><br>
         
         We want to inform you that the job application status of ${jobSeeker.fullName} for the position of ${jobListing.title} that is handled by recruiter ${recruiter.fullName} has been updated. Their current status is: <strong>${jobApplication.jobApplicationStatus}</strong>.<br><br>

         Kindly <a href="${loginLink}">log in</a> to your account for the next course of action.<br><br>
         
         Should you have any further questions, please don't hesitate to contact our administrative support team.<br><br>

         Thank you for choosing StarHire.<br><br>

         Warm regards,<br>
         The StarHire Team`,
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'Notification status email sent successfully',
        data: corporate,
      };
    } catch (err) {
      throw new HttpException(
        'Failed to send Notification status email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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

    try {
      await this.mailerService.sendMail({
        to: corporate.email,
        subject: `Job Application ID: ${jobApplication.jobApplicationId} Status Update for ${jobSeeker.fullName}`,
        html: `Dear <strong>${corporate.companyName}</strong>,<br><br>
         
         We want to inform you that there is a new job application status of ${jobSeeker.fullName} for the position of ${jobListing.title} that is forwarded by recruiter ${recruiter.fullName}

         Kindly <a href="${loginLink}">log in</a> to your account for the next course of action.<br><br>
         
         Should you have any further questions, please don't hesitate to contact our administrative support team.<br><br>

         Thank you for choosing StarHire.<br><br>

         Warm regards,<br>
         The StarHire Team`,
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'Notification status email sent successfully',
        data: corporate,
      };
    } catch (err) {
      throw new HttpException(
        'Failed to send Notification status email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async notifyJobSeekerOnMatchedJobListing(
    jobSeeker: JobSeeker,
    jobListing: JobListing,
    recruiter: Recruiter,
  ) {
    let loginLink = 'http://www.localhost:3001/login';

    try {
      await this.mailerService.sendMail({
        to: jobSeeker.email,
        subject: `Congratulation you have been matched!`,
        html: `Dear <strong>${jobSeeker.fullName}</strong>,<br><br>
         
         We want to inform you that you have been matched by recruiter ${recruiter.fullName} for the position of ${jobListing.title}

         Kindly <a href="${loginLink}">log in</a> to your account for the next course of action.<br><br>
         
         Should you have any further questions, please don't hesitate to contact our administrative support team.<br><br>

         Thank you for choosing StarHire.<br><br>

         Warm regards,<br>
         The StarHire Team`,
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'Notification status email sent successfully',
        data: jobSeeker,
      };
    } catch (err) {
      throw new HttpException(
        'Failed to send Notification status email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async notifyCorporateOfInvoice(corporate: Corporate, invoice: Invoice) {
    let loginLink = 'http://www.localhost:3001/login';

    try {
      await this.mailerService.sendMail({
        to: corporate.email,
        subject: `Incoming invoice ID: ${invoice.invoiceId}`,
        html: `Dear <Strong>${corporate.companyName}</Strong>,<br><br>
               We want to inform you about an incoming invoice that would be issued shortly<br>

               Please <a href="${loginLink}">Login</a> to your account to see the changes <br><br>

               For further enquiries please contact our Admin support staff <br><br>
               Thank you for using our service!<br><br>
               Best regards,<br>
               StarHire`,
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'Notification status email sent successfully',
        data: corporate,
      };
    } catch (err) {
      throw new HttpException(
        'Failed to send Notification status email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async notifyJobSeekerNewEvent(
    corporate: Corporate,
    eventListing: EventListing,
    jobSeeker: JobSeeker,
  ) {
    let loginLink = 'http://www.localhost:3001/login';

    try {
      await this.mailerService.sendMail({
        to: jobSeeker.email,
        subject: `New event posted by ${corporate.companyName}`,
        html: `Dear <Strong>${jobSeeker.fullName}</Strong>,<br><br>
               We want to inform you that a new event ${eventListing.eventName} happening at ${eventListing.location} has been posted by ${corporate.companyName}<br>

               Please <a href="${loginLink}">Login</a> to your account to view more details about the event<br><br>
               Best regards,<br>
               StarHire`,
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'Notification status email sent successfully',
        data: jobSeeker,
      };
    } catch (err) {
      throw new HttpException(
        'Failed to send Notification status email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

    async notifyChatRecipientImportantMessage(
    sender: User,
    recipient: User,
    chatMessage: ChatMessage,
  ) {
    let loginLink = 'http://www.localhost:3001/login';

    try {
      await this.mailerService.sendMail({
        to: recipient.email,
        subject: `New important message sent by ${sender.userName}`,
        html: `Dear <Strong>${recipient.userName}</Strong>,<br><br>
               ${sender.userName} has sent you an important message.<br><br>

               Important message content:<br>
               ${chatMessage.message}<br><br>
               
               Please <a href="${loginLink}">Login</a> to your account to view the important message<br><br>
               Best regards,<br>
               StarHire`,
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'Notification status email sent successfully',
        data: recipient,
      };
    } catch (err) {
      throw new HttpException(
        'Failed to send Notification status email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
