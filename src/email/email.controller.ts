import { Body, Controller, Get, HttpException, HttpStatus, InternalServerErrorException, Param, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { CreateEmailDto } from './dto/create-email.dto';
import { Public } from 'src/users/public.decorator';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Public()
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

  // @Get('/inform-status/:id')
  // async informJobListingStatus(
  //   @Param('id') id: number, // Define a DTO for your email data
  // ) {
  //   try {
  //     const result = await this.emailService.sendJobListingStatusEmail(id);

  //     return {
  //       statusCode: HttpStatus.OK,
  //       message: 'Job listing status email sent successfully',
  //       data: result,
  //     };
  //   } catch (error) {
  //     return {
  //       statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  //       message: 'Failed to send job listing status email',
  //       error: error.message,
  //     };
  //   }
  // }
}
