import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateForumPostDto } from './dto/create-forum-post.dto';
import { UpdateForumPostDto } from './dto/update-forum-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForumPost } from 'src/entities/forumPost.entity';

@Injectable()
export class ForumPostsService {
  constructor(
    @InjectRepository(ForumPost)
    private readonly forumPostRepository: Repository<ForumPost>,
  ) {}

  async create(createForumPostDto: CreateForumPostDto) {
    return 'This action adds a new forumPost';
  }

  async findAll() {
    return this.forumPostRepository.find();
  }

  async findOne(id: number) {
    try {
      return this.forumPostRepository.findOne({
        where: { forumPostId: id },
        relations: { forumComments: true },
      });
    } catch (err) {
      throw new HttpException(
        'Failed to find forum post',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: number, updateForumPostDto: UpdateForumPostDto) {
    return `This action updates a #${id} forumPost`;
  }

  async remove(id: number) {
    try {
      await this.forumPostRepository.delete({ forumPostId: id });
    } catch (err) {
      throw new HttpException(
        'Failed to delete forum post',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
