import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { TypeformService } from './typeform.service';

@Controller('typeform')
export class TypeformController {
  constructor(private readonly typeformService: TypeformService) {}

  @Get('/corporate/:email')
  async findCorporateInfoByEmail(@Param('email') email: string) {
    return await this.typeformService.getCorporateInfoByEmail(email);
  }

  @Get('/corporate/responses/:email')
  async findCorporateResponseByEmail(@Param('email') email: string) {
    return await this.typeformService.getCorporateResponseByEmail(email);
  }

  @Get('/jobseeker/:email')
  async findJobSeekerInfoByEmail(@Param('email') email: string) {
    return await this.typeformService.getJobSeekerInfoByEmail(email);
  }

  @Get('/jobseeker/responses/:email')
  async findJobSeekerResponseByEmail(@Param('email') email: string) {
    return await this.typeformService.getJobseekerResponseByEmail(email);
  }

  @Post('/corporate')
  async handleTypeformSubmissionCorporate(@Body('email') email: string) {
    return this.typeformService.handleFormSubmitCorporate(email);
  }

  @Post('/jobseeker')
  async handleTypeformSubmissionJobseeker(@Body('email') email: string) {
    return this.typeformService.handleFormSubmitJobseeker(email);
  }
}
