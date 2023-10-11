import { Controller, HttpException, HttpStatus, InternalServerErrorException, Post } from '@nestjs/common';
import { TwilioService } from './twilio.service';
import { Public } from 'src/users/public.decorator';

@Controller('twilio')
export class TwilioController {
  constructor(private readonly twilioService: TwilioService) {}

  // @Public()
  // @Post('/sendSMS')
  // async createSMS() {
  //   try {
  //     return await this.twilioService.sendSMS(
  //       'whatsapp:+6584568580',
  //       'Hello world',
  //     );
  //   } catch (error) {
  //     if (error instanceof HttpException) {
  //       throw new HttpException(error.message, HttpStatus.NOT_FOUND);
  //     } else {
  //       throw new InternalServerErrorException('Internal server error');
  //     }
  //   }
  // }
}
