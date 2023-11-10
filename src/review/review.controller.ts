import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpException, NotFoundException, Put } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  async create(@Body() createReviewDto: CreateReviewDto) {
    try {
      const result = await this.reviewService.create(createReviewDto);
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

  @Get()
  findAll() {
    return this.reviewService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(+id);
  }

  @Get('/users/:id/:role')
  async findUserListDropdown(
    @Param('id') id: string,
    @Param('role') role: string,
  ) {
    try {
      const result = await this.reviewService.findUserListDropdown(id, role);
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

  @Get('/retrieve/:id/:role')
  async retrieveReviews(
    @Param('id') id: string,
    @Param('role') role: string,
  ) {
    try {
      const result = await this.reviewService.findByUserIdRole(id, role);
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
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    try {
      return await this.reviewService.update(id, updateReviewDto);
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
      return this.reviewService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          `Review with ID ${id} not found`,
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
