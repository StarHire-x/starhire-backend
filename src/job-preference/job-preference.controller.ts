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
  HttpStatus,
  ConflictException,
} from '@nestjs/common';
import { JobPreferenceService } from './job-preference.service';
import { CreateJobPreferenceDto } from './dto/create-job-preference.dto';
import { UpdateJobPreferenceDto } from './dto/update-job-preference.dto';

@Controller('job-preference')
export class JobPreferenceController {
  constructor(private readonly jobPreferenceService: JobPreferenceService) {}

  @Post()
  async create(@Body() createJobPreferenceDto: CreateJobPreferenceDto) {
    try {
      return await this.jobPreferenceService.create(createJobPreferenceDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else if (error instanceof ConflictException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Get('/all')
  findAllJobPreferences() {
    return this.jobPreferenceService.findAll();
  }

  // GET /job-preference/:id
  @Get(':id')
  findOne(@Param('id') id: number) {
    try {
      return this.jobPreferenceService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Get('/job-seeker/:id')
  findByJobSeekerId(@Param('id') id: string) {
    try {
      return this.jobPreferenceService.findByJobSeekerId(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else if (error instanceof ConflictException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateJobPreferenceDto: UpdateJobPreferenceDto,
  ) {
    try {
      const updatedJobPreference = await this.jobPreferenceService.update(
        id,
        updateJobPreferenceDto,
      );
      return updatedJobPreference;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    try {
      return this.jobPreferenceService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          `Job Preference with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
