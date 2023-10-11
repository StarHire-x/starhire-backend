import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForumCategory } from 'src/entities/forumCategory.entity';
import { CreateForumCategoryDto } from './dto/create-forum-category.dto';
import { UpdateForumCategoryDto } from './dto/update-forum-category.dto';

@Injectable()
export class ForumCategoriesService {
  constructor(
    @InjectRepository(ForumCategory)
    private readonly forumCategoryRepository: Repository<ForumCategory>, // Parent Entity
  ) {}

  async create(createForumCategoryDto: CreateForumCategoryDto) {
    try {
      const { forumCategoryTitle, ...objectLiterals } = createForumCategoryDto;

      const forumCategoryExists = await this.forumCategoryRepository.findOne({
        where: { forumCategoryTitle: forumCategoryTitle },
      });
      if (forumCategoryExists) {
        throw new HttpException(
          'Category name already exists!',
          HttpStatus.BAD_REQUEST,
        );
      }
      const forumCategory = new ForumCategory({
        forumCategoryTitle,
        ...objectLiterals,
      });
      return await this.forumCategoryRepository.save(forumCategory);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Note: No child entities are returned, since it is not specified in the relations field
  async findAll() {
    return this.forumCategoryRepository.find();
  }

  // Retrieves one forum category with associated forumPosts and forumComments per
  async findOne(id: number) {
    try {
      return await this.forumCategoryRepository.findOne({
        where: { forumCategoryId: id },
        relations: { forumPosts: { forumComments: true } },
      });
    } catch (err) {
      throw new HttpException(
        'Failed to find forum category',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: number, updateForumCategoryDto: UpdateForumCategoryDto) {
    try {
      const forumCategory = await this.forumCategoryRepository.findOneBy({
        forumCategoryId: id,
      });
      if (!forumCategory) {
        throw new NotFoundException('Forum Category Id provided is not valid');
      }

      Object.assign(forumCategory, updateForumCategoryDto);
      return await this.forumCategoryRepository.save(forumCategory);
    } catch (err) {
      throw new HttpException(
        'Failed to update forum category',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Note: Associated child entities(forum comments) will be removed as well, since cascade is set to true in the entity class
  async remove(id: number) {
    try {
      return await this.forumCategoryRepository.delete({ forumCategoryId: id });
    } catch (err) {
      throw new HttpException(
        'Failed to delete forum category',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
