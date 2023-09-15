import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  NotFoundException,
  HttpException,
  InternalServerErrorException,
  HttpStatus,
  ParseIntPipe,
  Query,
  ConflictException,
} from '@nestjs/common';
import { AdministratorService } from './admin.service';
import { CreateAdministratorDto } from './dto/create-admin.dto';
import { UpdateAdministratorDto } from './dto/update-admin.dto';
import { QueryFailedError } from 'typeorm';

@Controller('administrators')
export class AdministratorController {
  constructor(private readonly administratorService: AdministratorService) {}

  @Post()
  createAdministrator(@Body() createAdministratorDto: CreateAdministratorDto) {
    try {
      return this.administratorService.create(createAdministratorDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Get('/all')
  findAllAdministrator() {
    try { 
      return this.administratorService.findAll();
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  // GET /users/:id
  @Get(':id')
  findOneAdministrator(@Param('id') id: string) {
    try {
      return this.administratorService.findOne(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Put(':id')
  updateAdministrator(
    @Param('id') id: string,
    @Body() updateAdministratorDto: UpdateAdministratorDto,
  ) {
    try {
      return this.administratorService.update(id, updateAdministratorDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Delete(':id')
  removeAdministrator(@Param('id') id:  string) {
    try {
      return this.administratorService.remove(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(
          error.message,
          HttpStatus.CONFLICT,
        );
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }
}
