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
} from '@nestjs/common';
import { ForumCommentsService } from './forum-comments.service';
import { CreateForumCommentDto } from './dto/create-forum-comment.dto';
import { UpdateForumCommentDto } from './dto/update-forum-comment.dto';

@Controller('forum-comments')
export class ForumCommentsController {
  constructor(private readonly forumCommentsService: ForumCommentsService) {}

  @Post()
  createForumComment(@Body() createForumCommentDto: CreateForumCommentDto) {
    try {
      return this.forumCommentsService.create(createForumCommentDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Get()
  findAllForumComments() {
    try {
      return this.forumCommentsService.findAll();
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Get(':id')
  findOneForumComment(@Param('id', ParseIntPipe) id: string) {
    try {
      return this.forumCommentsService.findOne(+id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Patch(':id')
  updateForumComment(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateForumCommentDto: UpdateForumCommentDto,
  ) {
    return this.forumCommentsService.update(+id, updateForumCommentDto);
  }

  @Delete(':id')
  removeForumComment(@Param('id', ParseIntPipe) id: string) {
    try {
      return this.forumCommentsService.remove(+id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }
}
