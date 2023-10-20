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

  @Get()
  findAll() {
    return this.typeformService.findAllCorporate();
  }

  @Get('/corporate/:email')
  async findCorporateInfoByEmail(@Param('email') email: string) {
    return await this.typeformService.getCorporateInfoByEmail(email);
  }

  @Get('/corporate/responses/:email')
  async findCorporateResponseByEmail(@Param('email') email: string) {
    return await this.typeformService.getCorporateResponseByEmail(email);
  }

  @Post('/corporate')
  async saveCorporateResponse(@Body('email') email: string) {
    return this.typeformService.saveCorporateResponseByEmail(email);
  }
}
