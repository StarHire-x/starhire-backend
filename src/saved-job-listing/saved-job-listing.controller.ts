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
  Req,
  Patch,
  NotFoundException,
} from '@nestjs/common';
import { SavedJobListingService } from './saved-job-listing.service';
import { CreateSavedJobListingDto } from './dto/create-saved-job-listing.dto';
import { UpdateSavedJobListingDto } from './dto/update-saved-job-listing.dto';

@Controller('saved-job-listing')
export class SavedJobListingController {
  constructor(
    private readonly savedJobListingService: SavedJobListingService,
  ) {}

  @Post()
  create(@Body() createSavedJobListingDto: CreateSavedJobListingDto) {
    return this.savedJobListingService.create(createSavedJobListingDto);
  }

  @Get()
  findAll() {
    return this.savedJobListingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.savedJobListingService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSavedJobListingDto: UpdateSavedJobListingDto,
  ) {
    return this.savedJobListingService.update(+id, updateSavedJobListingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.savedJobListingService.remove(+id);
  }

  @Post('/save/:jobListingId')
  async saveJobListing(
    @Req() req: any,
    @Param('jobListingId') jobListingId: number,
  ) {
    try {
      const jobSeekerId = req.user.sub;
      await this.savedJobListingService.saveJobListing(
        jobSeekerId,
        jobListingId,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Get('/saved/:userId')
  async getSavedJobListings(@Param('userId') userId: string) {
    try {
      const jobListings =
        await this.savedJobListingService.findSavedJobListingsByJobSeeker(
          userId,
        );

      // If there are job listings, return them
      if (jobListings && jobListings.length > 0) {
        return jobListings;
      } else {
        throw new NotFoundException(
          'No job listings found for user ID ' + userId,
        );
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }
}
