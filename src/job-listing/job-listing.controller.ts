import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Put,
} from '@nestjs/common';
import { JobListingService } from './job-listing.service';
import { CreateJobListingDto } from './dto/create-job-listing.dto';
import { UpdateJobListingDto } from './dto/update-job-listing.dto';
import { JobListing } from '../entities/jobListing.entity';

@Controller('job-listing')
export class JobListingController {
  constructor(private readonly jobListingService: JobListingService) {}

  @Post()
  // Note: Ensure dto contains a field for the Id of the parent entity parentId
  createJobListing(@Body() createJobListingDto: CreateJobListingDto) {
    try {
      return this.jobListingService.create(createJobListingDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Get()
  findAllJobListings() {
    try {
      return this.jobListingService.findAll();
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Get('/corporate/:userId')
  async findAllJobListingsByCorporate(@Param('userId') userId: string) {
    try {
      const result = await this.jobListingService.findAllByCorporate(userId);
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Get(':id')
  // Ensure that id provided is a number
  findOne(@Param('id') id: number) {
    try {
      return this.jobListingService.findOne(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Put(':id')
  updateJobListing(
    @Param('id') id: number, // Ensure that id provided is a number
    @Body() updateJobListingDto: UpdateJobListingDto,
  ) {
    try {
      return this.jobListingService.update(id, updateJobListingDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Put('/assignJobListing/:jobSeekerId/:jobListingId/:recruiterId')
  assignJobListing(
    @Param('jobSeekerId') jobSeekerId: string,
    @Param('jobListingId') jobListingId: number,
    @Param('recruiterId') recruiterId: string,
  ) {
    try {
      return this.jobListingService.assignJobListing(
        jobSeekerId,
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

  @Delete('/rejectJobListing/:jobSeekerId/:jobListingId')
  rejectJobListing(
    @Param('jobSeekerId') jobSeekerId: string,
    @Param('jobListingId') jobListingId: number,
  ) {
    try {
      console.log('Hello There');
      return this.jobListingService.deassignJobListing(
        jobSeekerId,
        jobListingId,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Delete(':id')
  // Ensure that id provided is a number
  removeJobListing(@Param('id') id: number) {
    try {
      return this.jobListingService.remove(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Get('/corporate/jobApplications/:id')
  findAllProcessingJobApplicationsByJobListing(@Param('id') id: number) {
    try {
      return this.jobListingService.getProcessingJobApplicationsByJobListingId(
        id,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Get('/assigned/:userId')
  async findAllJobListingsByJobSeeker(@Param('userId') userId: string) {
    try {
      const jobListings =
        await this.jobListingService.findAllByJobSeeker(userId);

      // Logging the data to inspect it
      console.log('Job Listings:', jobListings);

      return jobListings;
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }
}
