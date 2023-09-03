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
import { ForumPostsService } from './forum-posts.service';
import { CreateForumPostDto } from './dto/create-forum-post.dto';
import { UpdateForumPostDto } from './dto/update-forum-post.dto';

@Controller('forum-posts')
export class ForumPostsController {
  constructor(private readonly forumPostsService: ForumPostsService) {}

  @Post()
  createForumPost(@Body() createForumPostDto: CreateForumPostDto) {
    return this.forumPostsService.create(createForumPostDto);
  }

  @Get()
  findAllForumPosts() {
    return this.forumPostsService.findAll();
  }

  @Get(':id')
  findOneForumPost(@Param('id', ParseIntPipe) id: string) {
    return this.forumPostsService.findOne(+id);
  }

  @Patch(':id')
  updateForumPost(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateForumPostDto: UpdateForumPostDto,
  ) {
    return this.forumPostsService.update(+id, updateForumPostDto);
  }

  @Delete(':id')
  removeForumPost(@Param('id', ParseIntPipe) id: string) {
    return this.forumPostsService.remove(+id);
  }
}
