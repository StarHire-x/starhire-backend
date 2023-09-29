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
        subject: `Status Update on Job Listing: ${jobListing.jobListingId}, ${jobListing.title}`,
        html: `Dear <Strong>${jobListing.corporate.userName}</Strong>,<br><br>
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
