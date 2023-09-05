import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { ForumPostsService } from './forum-posts.service';
import { CreateForumPostDto } from './dto/create-forum-post.dto';
import { UpdateForumPostDto } from './dto/update-forum-post.dto';

@Controller('forum-posts')
export class ForumPostsController {
  constructor(private readonly forumPostsService: ForumPostsService) {}

  @Post()
  createForumPost(@Body() createForumPostDto: CreateForumPostDto) {
    try {
      const { jobSeeker, ...createForumPost } = createForumPostDto;
      return this.forumPostsService.create(jobSeeker.userId, createForumPostDto);
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
  findOneForumPost(@Param('id', ParseIntPipe) id: string) {
    try {
      return this.forumPostsService.findOne(+id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Put(':id')
  updateForumPost(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateForumPostDto: UpdateForumPostDto,
  ) {
    try {
      return this.forumPostsService.update(+id, updateForumPostDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Delete(':id')
  removeForumPost(@Param('id', ParseIntPipe) id: string) {
    try {
      return this.forumPostsService.remove(+id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }
}
