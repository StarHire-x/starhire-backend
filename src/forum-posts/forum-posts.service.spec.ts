import { Test, TestingModule } from '@nestjs/testing';
import { ForumPostsService } from './forum-posts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForumPost } from '../entities/forumPost.entity';
import { EntityManager } from 'typeorm';

describe('ForumPostsService', () => {
  let service: ForumPostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ForumPostsService,
        {
          provide: getRepositoryToken(ForumPost),
          useValue: {},
        },
        {
          provide: EntityManager,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ForumPostsService>(ForumPostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
