import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { JobAssignmentService } from './job-assignment.service';
import { CreateJobAssignmentDto } from './dto/create-job-assignment.dto';

@Controller('job-assignment')
export class JobAssignmentController {
  constructor(private readonly jobAssignmentService: JobAssignmentService) {}

  @Post()
  create(@Body() createJobAssignmentDto: CreateJobAssignmentDto) {
    try {
      return this.jobAssignmentService.create(createJobAssignmentDto);
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
      return this.jobAssignmentService.findAll();
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Get('/:jobListingId/:recruiterId')
  findByJobListingId(
    @Param('jobListingId') jobListingId: number,
    @Param('recruiterId') recruiterId: string,
  ) {
    try {
      return this.jobAssignmentService.findByJobListingId(
        jobListingId,
        recruiterId,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Get(':id')
  // Ensure that id provided is a number
  findOneByJobSeekerId(@Param('id') jobSeekerId: string) {
    try {
      return this.jobAssignmentService.findOneByJobSeekerId(jobSeekerId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }
}
