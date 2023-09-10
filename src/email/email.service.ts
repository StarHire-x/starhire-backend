import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateEmailDto } from './dto/create-email.dto';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async resetPassword(createEmailDto: CreateEmailDto) {
    try {
        await this.mailerService.sendMail({
          to: createEmailDto.emailAddress,
          subject: 'Reset Password',
          html: `This is the Token id: ${createEmailDto.tokenId}`,
        });

        return {
          statusCode: 200,
          message: 'Token id is send to your email, you have 1 hour to activate it',
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

