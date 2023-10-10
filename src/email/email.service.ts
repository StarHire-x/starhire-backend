import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateEmailDto } from './dto/create-email.dto';

import { JobListingService } from '../job-listing/job-listing.service';
import UserRoleEnum from '../enums/userRole.enum';
import { JobSeeker } from 'src/entities/jobSeeker.entity';
import { JobApplication } from 'src/entities/jobApplication.entity';
import { JobListing } from 'src/entities/jobListing.entity';
import { Corporate } from 'src/entities/corporate.entity';
import { Recruiter } from 'src/entities/recruiter.entity';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService, // We should not be calling other service classes to avoid cyclic dependency
    // private readonly jobListingService: JobListingService,
  ) {}

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

  //Change in state for job listing on admin side
  // async sendJobListingStatusEmail(jobListingId: number) {
  //   const jobListing =
  //     await this.jobListingService.findJobListingWithCorporate(jobListingId);

  //   try {
  //     await this.mailerService.sendMail({
  //       to: jobListing.corporate.email,
  //       subject: `Status Update on Job Listing: ${jobListing.jobListingId}, ${jobListing.title}`,
  //       html: `Dear <Strong>${jobListing.corporate.userName}</Strong>,<br><br>
  //              We want to inform you about the status of your job listing.<br>

  //              Your Job Listing ID: <strong>${
  //                jobListing.jobListingId
  //              }</strong>, <strong>${jobListing.title}</strong><br><br>
  //              has been <strong>${jobListing.jobListingStatus.toUpperCase()}</strong> <br><br>

  //              Please <a href="http://www.localhost:3001/login">Login</a> to your account to see the changes <br><br>

  //              For further enquiries please contact our Admin support staff <br><br>
  //              Thank you for using our service!<br><br>
  //              Best regards,<br>
  //              StarHire`,
  //     });
  //     return {
  //       statusCode: HttpStatus.OK,
  //       message: 'Job listing status email sent successfully',
  //       data: jobListing,
  //     };
  //   } catch (err) {
  //     throw new HttpException(
  //       'Failed to send job listing status email',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

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
        subject: `Status Update for User: ${user.userName}`,
        html: `Dear <Strong>${user.userName}</Strong> with a role of <Strong>${user.role}</Strong>,<br><br>
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

  // inform job seeker of job application status - havent add to method yet
  async notifyJobSeekeronApplicationStatus(
    jobSeeker: JobSeeker,
    jobApplication: JobApplication,
    jobListing: JobListing,
  ) {
    let loginLink = 'http://www.localhost:3001/login';

    try {
      await this.mailerService.sendMail({
        to: jobSeeker.email,
        subject: `Job Application Status Update for ${jobSeeker.fullName}`,
        html: `Dear <strong>${jobSeeker.fullName}</strong>,<br><br>
         
         We are pleased to inform you that your application status for the position of ${jobListing.title} has been updated. Your current status is: <strong>${jobApplication.jobApplicationStatus}</strong>.<br><br>

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

  // inform corporate of submitted job application - havent add to method yet
  async notifyCorporateOnNewJobApplication(
    corporate: Corporate,
    jobListing: JobListing,
    recruiter: Recruiter,
  ) {
    let loginLink = 'http://www.localhost:3001/login';

    try {
      await this.mailerService.sendMail({
        to: corporate.email,
        subject: `New Job Application for ${corporate.companyName}`,
        html: `Dear Team at <strong>${corporate.companyName}</strong>,<br><br>
         
         We're delighted to notify you that a job application has been submitted for the position of ${jobListing.title} by recruiter ${recruiter.userName}.<br><br>

         Please <a href="${loginLink}">log in</a> to your account to view further details.<br><br>

         If you have any queries, feel free to reach out to our administrative support team.<br><br>

         Thank you for trusting StarHire.<br><br>
         
         Best regards,<br>
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

  
}
