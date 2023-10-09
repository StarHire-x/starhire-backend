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
import { ForumPostsService } from './forum-posts.service';
import { CreateForumPostDto } from './dto/create-forum-post.dto';
import { UpdateForumPostDto } from './dto/update-forum-post.dto';

@Controller('forum-posts')
export class ForumPostsController {
  constructor(private readonly forumPostsService: ForumPostsService) {}

  @Post()
  // Ensure dto contains the id field for Job Seeker
  createForumPost(@Body() createForumPostDto: CreateForumPostDto) {
    try {
      return this.forumPostsService.create(createForumPostDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Get()
  findAllForumPosts() {
    try {
      return this.forumPostsService.findAll();
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
  findOneForumPost(@Param('id') id: number) {
    try {
      return this.forumPostsService.findOne(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Get('/jobSeeker/:jobSeekerId')
  findForumPostsByJobSeekerId(@Param('jobSeekerId') jobSeekerId: string) {
    try {
      return this.forumPostsService.findForumPostsByJobSeekerId(jobSeekerId);
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
  updateForumPost(
    @Param('id') id: number,
    @Body() updateForumPostDto: UpdateForumPostDto,
  ) {
    try {
      return this.forumPostsService.update(id, updateForumPostDto);
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
  removeForumPost(@Param('id') id: number) {
    try {
      return this.forumPostsService.remove(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }
}
