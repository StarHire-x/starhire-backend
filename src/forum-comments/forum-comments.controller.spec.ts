import { Test, TestingModule } from '@nestjs/testing';
import { ForumCommentsController } from './forum-comments.controller';
import { ForumCommentsService } from './forum-comments.service';

describe('ForumCommentsController', () => {
  let controller: ForumCommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ForumCommentsController],
      providers: [ForumCommentsService],
    }).compile();

    controller = module.get<ForumCommentsController>(ForumCommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
