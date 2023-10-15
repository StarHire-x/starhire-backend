import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { ForumCategoriesService } from './forum-categories.service';
import { CreateForumCategoryDto } from './dto/create-forum-category.dto';
import { UpdateForumCategoryDto } from './dto/update-forum-category.dto';

@Controller('forum-categories')
export class ForumCategoriesController {
  constructor(
    private readonly forumCategoriesService: ForumCategoriesService,
  ) {}
  @Post()
  async createForumCategory(
    @Body() createForumCategoryDto: CreateForumCategoryDto,
  ) {
    try {
      await this.forumCategoriesService.create(createForumCategoryDto);
      return;
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }
  @Get()
  findAllForumCategories() {
    try {
      return this.forumCategoriesService.findAll();
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
  findOneForumCategory(@Param('id') id: number) {
    try {
      return this.forumCategoriesService.findOne(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }
  @Put(':id')
  // Ensure that id provided is a number
  updateForumCategory(
    @Param('id') id: number,
    @Body() updateForumCategoryDto: UpdateForumCategoryDto,
  ) {
    try {
      return this.forumCategoriesService.update(id, updateForumCategoryDto);
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
  removeForumCategory(@Param('id') id: number) {
    try {
      return this.forumCategoriesService.remove(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }
}
