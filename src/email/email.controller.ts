import { Body, Controller, HttpException, HttpStatus, InternalServerErrorException, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { CreateEmailDto } from './dto/create-email.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('/reset')
  async createEmail(@Body() createEmailDto: CreateEmailDto) {
    try {
        console.log(createEmailDto);
      return await this.emailService.resetPassword(createEmailDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }
}
