import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';
import UserRoleEnum from 'src/enums/userRole.enum';

@Injectable()
export class TwilioService {
  private readonly client: twilio.Twilio;

  constructor(private configService: ConfigService) {
    this.client = new twilio.Twilio(
      configService.get<string>('TWILIO_ACCOUNT_SID'),
      configService.get<string>('TWILIO_AUTH_TOKEN'),
    );
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

    if(!user.contactNo) {
      return;
    } 

    const message = `Hello ${user.name}, You have changed your notification settings to ${user.notificationMode}
    Please use the following link to login: ${loginLink} to see the changes`;
    
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
      throw new HttpException(
        'Failed to send SMS',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
