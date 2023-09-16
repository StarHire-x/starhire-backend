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
  UseGuards,
} from '@nestjs/common';
import { JobListingService } from './job-listing.service';
import { CreateJobListingDto } from './dto/create-job-listing.dto';
import { UpdateJobListingDto } from './dto/update-job-listing.dto';
import { JobListing } from 'src/entities/jobListing.entity';
import { Public } from 'src/users/public.decorator';

@Controller('job-listing')
export class JobListingController {
  constructor(private readonly jobListingService: JobListingService) {}

  @Public()
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
      // const numericUserId = parseInt(userId, 10); // Convert string userId to a number.
      // if (isNaN(numericUserId)) {
      //   // Check if the conversion was successful.
      //   throw new HttpException('Invalid user ID', HttpStatus.BAD_REQUEST);
      // }
      const result = await this.jobListingService.findAllByCorporate(userId);
      //console.log(result);
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

  // @Public()
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
}
