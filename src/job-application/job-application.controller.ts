import { Controller, Get, Post, Body, Patch, Param, Delete, Put, HttpException, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { JobApplicationService } from './job-application.service';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { UpdateJobApplicationDto } from './dto/update-job-application.dto';

@Controller('job-application')
export class JobApplicationController {
  constructor(private readonly jobApplicationService: JobApplicationService) {}

  @Post()
  create(@Body() createJobApplicationDto: CreateJobApplicationDto) {
    try {
      return this.jobApplicationService.create(createJobApplicationDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Get()
  findAll() {
    try {
      return this.jobApplicationService.findAll();
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
    
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.jobApplicationService.findOne(+id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
    
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateJobApplicationDto: UpdateJobApplicationDto) {
    try {
      return this.jobApplicationService.update(+id, updateJobApplicationDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.jobApplicationService.remove(+id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }
}
