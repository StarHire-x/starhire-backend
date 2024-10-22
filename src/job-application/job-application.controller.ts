import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { JobApplicationService } from './job-application.service';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { UpdateJobApplicationDto } from './dto/update-job-application.dto';

@Controller('job-application')
export class JobApplicationController {
  constructor(private readonly jobApplicationService: JobApplicationService) {}

  @Post()
  // Ensure dto contains the id field for the following parent entities: Job Listing, Job Seeker & Recruiter
  async create(@Body() createJobApplicationDto: CreateJobApplicationDto) {
    try {
      return await this.jobApplicationService.create(createJobApplicationDto);
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
  // Ensure that id provided is a number
  findOne(@Param('id') id: number) {
    try {
      return this.jobApplicationService.findOne(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Get('/yet-commission/:recruiterId')
  async findYetCommissionedSuccessfulJobApplicationsByRecruiterId(
    @Param('recruiterId') recruiterId: string,
  ) {
    try {
      return await this.jobApplicationService.findAllYetCommissionedSuccessfulJobAppsByRecruiterId(
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

  @Get('/jobSeeker/:jobSeekerId')
  async findJobApplicationsByJobSeeker(
    @Param('jobSeekerId') jobSeekerId: string,
  ) {
    try {
      return await this.jobApplicationService.getJobApplicationByJobSeeker(
        jobSeekerId,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Get('/existing/:jobSeekerId/:jobListingId')
  // Check whether an existing job application has already been created
  async findExistingJobApplication(
    @Param('jobSeekerId') jobSeekerId: string,
    @Param('jobListingId') jobListingId: number,
  ) {
    try {
      return await this.jobApplicationService.getJobApplicationByJobSeekerJobListing(
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

  @Get('job-listing/:joblistingId/:recruiterId')
  findAllByJobListingId(
    @Param('joblistingId') jobListingId: number,
    @Param('recruiterId') recruiterId: string,
  ) {
    try {
      return this.jobApplicationService.findAllByJobListingId(
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

  @Put(':id')
  update(
    @Param('id') id: number, // Ensure that id provided is a number
    @Body() updateJobApplicationDto: UpdateJobApplicationDto,
  ) {
    try {
      console.log(id, updateJobApplicationDto);

      /*
      if (updateJobApplicationDto.hasOwnProperty('jobApplicationStatus')) {
        console.log("This field is present");
      }
      */

      return this.jobApplicationService.update(id, updateJobApplicationDto);
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
  remove(@Param('id') id: number) {
    try {
      return this.jobApplicationService.remove(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Get('/corporate/jobSeekers/:id')
  // Ensure that id provided is a number
  findAllAssignedJobSeekers(@Param('id') id: number) {
    try {
      return this.jobApplicationService.getJobSeekersByJobApplicatonId(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }
}
