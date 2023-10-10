import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateEmailDto } from './dto/create-email.dto';

import { JobListingService } from '../job-listing/job-listing.service';
import UserRoleEnum from '../enums/userRole.enum';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    // We should not be calling other service classes to avoid cyclic dependency
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
}
