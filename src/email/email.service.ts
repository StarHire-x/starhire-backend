import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateEmailDto } from './dto/create-email.dto';

import { JobListingService } from '../job-listing/job-listing.service';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly jobListingService: JobListingService,
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
  async sendJobListingStatusEmail(jobListingId: number) {
    const jobListing =
      await this.jobListingService.findJobListingWithCorporate(jobListingId);

    try {
      await this.mailerService.sendMail({
        to: jobListing.corporate.email,
        subject:
          'Job Listing ID: <Strong>${jobListing.jobListingId}</Strong> Status Update',
        html: `Dear <Strong>${jobListing.corporate.userName}</Strong>,<br><br>
               We want to inform you about the status of your job listing.<br>

               Your Job Listing ID: <strong>${
                 jobListing.jobListingId
               }</strong>, <strong>${jobListing.title}</strong><br><br>
               has been<strong>${jobListing.jobListingStatus.toUpperCase()}</strong>

               Please login to your account to see the changes <a href="http://www.localhost:3000/login">Login</a>

               If you think this is a mistake, please contact our help desk 
               Thank you for using our service!<br><br>
               Best regards,<br>
               Starhire`,
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'Job listing status email sent successfully',
        data: jobListing,
      };
    } catch (err) {
      throw new HttpException(
        'Failed to send job listing status email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
