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
      if (error instanceof ConflictException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Get('/all')
  findAllAdministrator() {
    console.log('got here');
    return this.administratorService.findAll();
  }

  // GET /users?id=1
  @Get()
  getNinjas(@Query('id') id: number) {
    try {
      return this.administratorService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  // GET /users/:id
  @Get(':id')
  findOneAdministrator(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.administratorService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Put(':id')
  updateAdministrator(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateEmployerDto: UpdateAdministratorDto,
  ) {
    try {
      return this.administratorService.update(+id, updateEmployerDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Delete(':id')
  removeUser(@Param('id', ParseIntPipe) id: string) {
    try {
      return this.administratorService.remove(+id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          `User with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }
}
