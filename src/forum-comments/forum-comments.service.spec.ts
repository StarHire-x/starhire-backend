import { Test, TestingModule } from '@nestjs/testing';
import { ForumCommentsService } from './forum-comments.service';

describe('ForumCommentsService', () => {
  let service: ForumCommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ForumCommentsService],
    }).compile();

    service = module.get<ForumCommentsService>(ForumCommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
