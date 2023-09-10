import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateEmailDto } from './dto/create-email.dto';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async resetPassword(createEmailDto: CreateEmailDto) {
    try {
        let resetLink;
        if (
          createEmailDto.role === 'Job_Seeker' ||
          createEmailDto.role === 'Corporate'
        ) {
          resetLink = `http://localhost:3001/resetPassword/?tokenId=${createEmailDto.tokenId}`;
        } else if (
          createEmailDto.role === 'Administrator' ||
          createEmailDto.role === 'Recruiter'
        ) {
          resetLink = `http://localhost:3000/resetPassword/?tokenId=${createEmailDto.tokenId}`;
        } else {
          throw new HttpException(
            'Invalid role specified',
            HttpStatus.BAD_REQUEST,
          );
        }

        await this.mailerService.sendMail({
          to: createEmailDto.emailAddress,
          subject: 'Reset Password',
          html: `Click on the following link to reset your password: <a href="${resetLink}">Reset Password</a>`,
        });

        return {
          statusCode: 200,
          message: 'Reset Link is send to your email, you have 1 hour to activate it',
          data: createEmailDto,
        };
    } catch (err) {
        throw new HttpException(
          'Failed to send reset password email',
          HttpStatus.BAD_REQUEST,
        );
    } 
  }
    
  }

