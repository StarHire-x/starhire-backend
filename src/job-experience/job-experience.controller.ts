import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  NotFoundException,
  HttpException,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { JobExperienceService } from './job-experience.service';
import { CreateJobExperienceDto } from './dto/create-job-experience.dto';
import { UpdateJobExperienceDto } from './dto/update-job-experience.dto';
import { Public } from 'src/users/public.decorator';

@Controller('job-experience')
export class JobExperienceController {
  constructor(private readonly jobExperienceService: JobExperienceService) {}

  @Post()
  async create(@Body() createJobExperienceDto: CreateJobExperienceDto) {
    try {
      return await this.jobExperienceService.create(createJobExperienceDto);
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

  @Get('/all')
  findAll() {
    return this.jobExperienceService.findAll();
  }

  // GET /job-experience/:id
  @Get(':id')
  findOne(@Param('id') id: number) {
    try {
      return this.jobExperienceService.findOne(id);
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
  async findByJobSeekerId(@Param('id') id: string) {
    try {
      const result = await this.jobExperienceService.findByJobSeekerId(id);
      console.log(result);
      return result;
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

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateJobExperienceDto: UpdateJobExperienceDto,
  ) {
    try {
      return await this.jobExperienceService.update(id, updateJobExperienceDto);
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
      return this.jobExperienceService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          `Job Experience with ID ${id} not found`,
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
