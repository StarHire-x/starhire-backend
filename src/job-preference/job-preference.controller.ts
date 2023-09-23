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
  ConflictException,
  Query,
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
      console.log('Hello there');
      return await this.jobPreferenceService.create(createJobPreferenceDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
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
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Get('/job-seeker/:id')
  findByJobSeekerId(@Param('id') id: string) {
    try {
      return this.jobPreferenceService.findByJobSeekerId(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateEmployerDto: UpdateJobPreferenceDto,
  ) {
    try {
      console.log("Hit update endpoint");
      return this.jobPreferenceService.update(id, updateEmployerDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new InternalServerErrorException('Internal server error');
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
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }
}
