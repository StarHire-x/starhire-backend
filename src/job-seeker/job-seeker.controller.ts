import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  NotFoundException,
  HttpException,
  InternalServerErrorException,
  HttpStatus,
  ConflictException,
} from '@nestjs/common';
import { JobSeekerService } from './job-seeker.service';
import { CreateJobSeekerDto } from './dto/create-job-seeker.dto';
import { UpdateJobSeekerDto } from './dto/update-job-seeker.dto';

@Controller('job-seeker')
export class JobSeekerController {
  constructor(private readonly jobSeekerService: JobSeekerService) {}

  @Post()
  createJobSeeker(@Body() createJobSeekerDto: CreateJobSeekerDto) {
    try {
      return this.jobSeekerService.create(createJobSeekerDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Get()
  findAllJobSeeker() {
    return this.jobSeekerService.findAll();
  }

  // GET /job-seeker/:id
  @Get(':id')
  findOneJobSeeker(@Param('id') id: string) {
    try {
      return this.jobSeekerService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }
 
  @Get('/followings/:id')
  findJobSeekerFollowings(@Param('id') id: string) {
    try {
      return this.jobSeekerService.findMyFollowings(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Put(':id')
  updateJobSeeker(
    @Param('id') id: string,
    @Body() updatedJobSeeker: UpdateJobSeekerDto,
  ) {
    try {
      return this.jobSeekerService.update(id, updatedJobSeeker);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Delete(':id')
  removeJobSeeker(@Param('id') id: string) {
    try {
      return this.jobSeekerService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          `Job Seeker with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }
}
