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
import { ForumCommentsService } from './forum-comments.service';
import { CreateForumCommentDto } from './dto/create-forum-comment.dto';
import { UpdateForumCommentDto } from './dto/update-forum-comment.dto';

@Controller('forum-comments')
export class ForumCommentsController {
  constructor(private readonly forumCommentsService: ForumCommentsService) {}

  @Post()
  // Ensure dto contains the id field for the following parent entities: Job Seeker & ForumPost
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

  @Get('/forumPost/:forumPostId')
  // Ensure that id provided is a number
  findCommentsByForumPostId(@Param('forumPostId') forumPostId: number) {
    try {
      return this.forumCommentsService.findCommentsByForumPostId(forumPostId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  // @Get(':id')
  // // Ensure that id provided is a number
  // findOneForumComment(@Param('id') id: number) {
  //   try {
  //     return this.forumCommentsService.findOne(id);
  //   } catch (error) {
  //     if (error instanceof HttpException) {
  //       throw new HttpException(error.message, HttpStatus.CONFLICT);
  //     } else {
  //       throw new InternalServerErrorException('Internal server error');
  //     }
  //   }
  // }

  @Put(':id')
  // Ensure that id provided is a number
  updateForumComment(
    @Param('id') id: number,
    @Body() updateForumCommentDto: UpdateForumCommentDto,
  ) {
    try {
      return this.forumCommentsService.update(id, updateForumCommentDto);
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
  removeForumComment(@Param('id') id: number) {
    try {
      return this.forumCommentsService.remove(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }
}
