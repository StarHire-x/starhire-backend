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

  async notifyCorporateOnJobListingStatus(
    corporate: Corporate,
    jobListing: JobListing,
  ) {
    let loginLink = 'http://www.localhost:3001/login';

    try {
      await this.mailerService.sendMail({
        to: corporate.email,
        subject: `Update on Job Listing ID: ${jobListing.jobListingId}, ${jobListing.title}`,
        html: `Dear <Strong>${corporate.userName}</Strong>,<br><br>

               Your Job Listing ID: <strong>${
                 jobListing.jobListingId
               }</strong>, <strong>${jobListing.title}</strong><br><br>
               has been <strong>${jobListing.jobListingStatus.toUpperCase()}</strong> <br><br>

               You can <a href="${loginLink}">Login</a> to your account to follow up. <br><br>

               For further enquiries, do send in a ticket and our Administrator will contact you. <br><br>

               Thank you for using our service! <br><br><br>
               Best regards, <br>
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
    let loginLink = 'http://www.localhost:3000/login';

    try {
      await this.mailerService.sendMail({
        to: recruiter.email,
        subject: `New Job Listing ID: ${jobListing.jobListingId}, ${jobListing.title}`,
        html: `Dear <Strong>${recruiter.fullName}</Strong>,<br><br>
               A new job listing, ${jobListing.title} created by ${corporate.schoolName} has been approved! <br>

               You can <a href="${loginLink}">Login</a> to your account to start matching this job listing to suitable job seekers. <br><br><br>

               Best regards, <br>
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
    let loginLink = 'http://www.localhost:3000/login';

    try {
      await this.mailerService.sendMail({
        to: admin.email,
        subject: `New Job Listing ID: ${jobListing.jobListingId}, ${jobListing.title}`,
        html: `Dear <Strong>${admin.fullName}</Strong>,<br><br>
               A new job listing ${jobListing.title}, with ID ${jobListing.jobListingId}, has been created by ${corporate.schoolName}! <br> 
               Please <a href="${loginLink}">Login</a> to vet this job listing. <br><br><br>

               Best regards, <br>
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
        subject: `Change of Notification Mode`,
        html: `Dear <Strong>${user.firstName}</Strong>, <br><br>
             This is to confirm that you have changed your notification mode to ${user.notificationMode}. <br>

             Please <a href="${loginLink}">Login</a> to your account to see the changes <br><br>

             If you did not make this change, send in a ticket immediately and our Administrator will contact you. <br><br>

             Thank you for using our service! <br><br><br>
             Best regards, <br>
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
        subject: `Update on ticket ${ticket.ticketName}`,
        html: `Dear <Strong>${user.userName}</Strong>, <br><br>
             Our Administrator has resolved the ticket ${ticket.ticketName} of the category 
             ${ticket.ticketCategory} that you sent in. <br>
             You can <a href="${loginLink}">Login</a> to your account to see the changes. <br><br>
             If you still encounter difficulties, do send in another ticket and our Administrator will contact you. <br><br>

             Thank you for using our service! <br><br><br>
             Best regards, <br>
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
        subject: `Update on Job Application ID: ${jobApplication.jobApplicationId} for ${jobSeeker.firstName}`,
        html: `Dear <strong>${jobSeeker.firstName}</strong>,<br><br>
         
         Your job application status for the position of <strong>${jobListing.title}</strong> at <strong>${corporate.schoolName}</strong> has been updated. The current status of your job application is: <strong>${jobApplication.jobApplicationStatus}</strong>.<br><br>
         You can <a href="${loginLink}">Login</a> to your account to follow up. <br><br>
         For further enquiries, do contact recruiter <strong>${recruiter.fullName}</strong> who is handling your job application. <br><br>

         Thank you for using our service! <br><br><br>
         Best regards, <br>
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
        subject: `Update on Job Application ID: ${jobApplication.jobApplicationId} for ${jobSeeker.firstName}`,
        html: `Dear <strong>${recruiter.fullName}</strong>, <br><br>
         
         The job application status of ${jobSeeker.firstName} for the position of ${jobListing.title} at ${corporate.schoolName} has been updated. The current status of the job application is: <strong>${jobApplication.jobApplicationStatus}</strong>. <br><br>
         You can <a href="${loginLink}">Login</a> to your account to follow up. <br><br>
         
         Best regards, <br>
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
        subject: `Update on Job Application ID: ${jobApplication.jobApplicationId} for ${jobSeeker.firstName}`,
        html: `Dear <strong>${corporate.schoolName}</strong>, <br><br>
         
         The job application status of ${jobSeeker.firstName} for the position of ${jobListing.title} has been updated. The current status of the job application is: <strong>${jobApplication.jobApplicationStatus}</strong>. <br><br>
         You can <a href="${loginLink}">Login</a> to your account to follow up. <br><br>
         For further enquiries, do contact recruiter <strong>${recruiter.fullName}</strong> who is handling this job application. <br><br>

         Thank you for using our service! <br><br><br>
         Best regards, <br>
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
        subject: `New Job Application ID: ${jobApplication.jobApplicationId} from ${jobSeeker.firstName}`,
        html: `Dear <strong>${corporate.schoolName}</strong>,<br><br>
         
         A job seeker, ${jobSeeker.firstName} applied for the position of ${jobListing.title}! <br><br> 
         You can <a href="${loginLink}">Login</a> to your account to follow up. <br><br>
         For further enquiries, do contact recruiter <strong>${recruiter.fullName}</strong> who is handling this job application. <br><br>

         Thank you for using our service! <br><br><br>
         Best regards, <br>
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

  async notifyJobSeekerOnMatchedJobListing(
    jobSeeker: JobSeeker,
    jobListing: JobListing,
    recruiter: Recruiter,
  ) {
    let loginLink = 'http://www.localhost:3001/login';

    try {
      await this.mailerService.sendMail({
        to: jobSeeker.email,
        subject: `A new job has been matched to you!`,
        html: `Dear <strong>${jobSeeker.firstName}</strong>, <br><br>
         
         Congratulations! You have a new job ${jobListing.title} matched to you. <br>
         <a href="${loginLink}">Login</a> to your account to check it out and start applying! <br><br>

         For further enquiries, do contact recruiter <strong>${recruiter.fullName}</strong>. <br><br>

         Thank you for using our service! <br><br><br>
         Best regards, <br>
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

  async notifyCorporateOfInvoice(corporate: Corporate, invoice: Invoice) {
    let loginLink = 'http://www.localhost:3001/login';

    try {
      await this.mailerService.sendMail({
        to: corporate.email,
        subject: `Incoming Invoice ID: ${invoice.invoiceId}`,
        html: `Dear <Strong>${corporate.schoolName}</Strong>,<br><br>
               This is to inform you about an incoming invoice that would be issued shortly. <br>
               You can <a href="${loginLink}">Login</a> to your account to check. <br><br>

               For further enquiries, do send in a ticket and our Administrator will contact you. <br><br>

               Thank you for using our service! <br><br><br>
               Best regards, <br>
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
        subject: `New Event posted by ${corporate.schoolName}`,
        html: `Dear <Strong>${jobSeeker.firstName}</Strong>,<br><br>

               A new event ${eventListing.eventName} happening at ${eventListing.location} has been posted by ${corporate.schoolName}!<br>

               <a href="${loginLink}">Login</a> to your account to check it out! <br><br>
               
               Thank you for using our service! <br><br><br>
               Best regards, <br>
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
               
               Thank you for using our service! <br><br><br>
               Best regards, <br>
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

  async notifyJobSeekerCancelledEvent(
    eventListing: EventListing,
    jobSeeker: JobSeeker,
  ) {
    try {
      await this.mailerService.sendMail({
        to: jobSeeker.email,
        subject: `Cancellation of event ${eventListing.eventName}`,
        html: `Dear <Strong>${jobSeeker.firstName}</Strong>,<br><br>
               We regret to inform you that the event <Strong>${eventListing.eventName}</Strong> happening at ${eventListing.location} has been cancelled.<br>

               <br><br>
               Best regards, <br>
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
}
