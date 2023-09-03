import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
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
    return this.forumCommentsService.create(createForumCommentDto);
  }

  @Get()
  findAllForumComments() {
    return this.forumCommentsService.findAll();
  }

  @Get(':id')
  findOneForumComment(@Param('id', ParseIntPipe) id: string) {
    return this.forumCommentsService.findOne(+id);
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
    return this.forumCommentsService.remove(+id);
  }
}
