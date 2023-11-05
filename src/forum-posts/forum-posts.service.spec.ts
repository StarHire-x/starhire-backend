import { Test, TestingModule } from '@nestjs/testing';
import { ForumPostsService } from './forum-posts.service';
import { ForumCategory } from '../entities/forumCategory.entity';
import { ForumPost } from '../entities/forumPost.entity';
import { JobSeeker } from '../entities/jobSeeker.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import ForumPostEnum from '../enums/forumPost.enum';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { ForumComment } from '../entities/forumComment.entity';

describe('ForumPostsService', () => {
  let forumPostService: ForumPostsService;
  let forumPostRepository: Repository<ForumPost>;
  let jobSeekerRepository: Repository<JobSeeker>;
  let forumCategoryRepository: Repository<ForumCategory>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ForumPostsService,
        {
          provide: getRepositoryToken(ForumPost),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(JobSeeker),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(ForumCategory),
          useClass: Repository,
        },
      ],
    }).compile();

    forumPostService = module.get<ForumPostsService>(ForumPostsService);
    jobSeekerRepository = module.get<Repository<JobSeeker>>(
      getRepositoryToken(JobSeeker),
    );
    forumPostRepository = module.get<Repository<ForumPost>>(
      getRepositoryToken(ForumPost),
    );
    forumCategoryRepository = module.get<Repository<ForumCategory>>(
      getRepositoryToken(ForumCategory),
    );
  });

  it('should be defined', () => {
    expect(forumPostService).toBeDefined();
    expect(jobSeekerRepository).toBeDefined();
    expect(forumPostRepository).toBeDefined();
    expect(forumCategoryRepository).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a forum post', async () => {
      const jobSeekerId = '1';
      const forumCategoryId = 1;
      const createForumPostDto = {
        forumPostTitle: 'New Forum Post',
        createdAt: new Date('2023-10-10'),
        forumPostMessage: 'This is the content of the new post',
        isAnonymous: false,
        forumPostStatus: ForumPostEnum.Pending,
        jobSeekerId,
        forumCategoryId,
      };

      const jobSeeker = new JobSeeker({ userId: jobSeekerId });
      const forumCategory = new ForumCategory({
        forumCategoryId: forumCategoryId,
      });

      const forumPost = new ForumPost({
        forumPostId: 1,
        forumPostTitle: 'New Forum Post',
        createdAt: new Date('2023-10-10'),
        forumPostMessage: 'This is the content of the new post',
        isAnonymous: false,
        forumPostStatus: ForumPostEnum.Pending,
        jobSeeker: jobSeeker,
        forumCategory: forumCategory,
      });

      jest
        .spyOn(jobSeekerRepository, 'findOneBy')
        .mockResolvedValueOnce(jobSeeker);
      jest
        .spyOn(forumCategoryRepository, 'findOneBy')
        .mockResolvedValueOnce(forumCategory);
      jest.spyOn(forumPostRepository, 'save').mockResolvedValueOnce(forumPost);

      const result = await forumPostService.create(createForumPostDto);

      expect(result).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'Forum post has been created',
      });
    });

    it('should throw NotFoundException if job seeker ID is invalid', async () => {
      const jobSeekerId = '0';
      const forumCategoryId = 1;
      const createForumPostDto = {
        forumPostTitle: 'New Forum Post',
        createdAt: new Date('2023-10-10'),
        forumPostMessage: 'This is the content of the new post',
        isAnonymous: false,
        forumPostStatus: ForumPostEnum.Pending,
        jobSeekerId,
        forumCategoryId,
      };

      jest.spyOn(jobSeekerRepository, 'findOneBy').mockResolvedValue(null);

      await expect(forumPostService.create(createForumPostDto)).rejects.toThrow(
        new NotFoundException('Job Seeker Id provided is not valid'),
      );
    });

    it('should throw NotFoundException if forum category ID is invalid', async () => {
      const jobSeekerId = '1';
      const forumCategoryId = 1;
      const createForumPostDto = {
        forumPostTitle: 'New Forum Post',
        createdAt: new Date('2023-10-10'),
        forumPostMessage: 'This is the content of the new post',
        isAnonymous: false,
        forumPostStatus: ForumPostEnum.Pending,
        jobSeekerId,
        forumCategoryId,
      };

      const jobSeeker = new JobSeeker({ userId: jobSeekerId });

      jest.spyOn(jobSeekerRepository, 'findOneBy').mockResolvedValue(jobSeeker);
      jest.spyOn(forumCategoryRepository, 'findOneBy').mockResolvedValue(null);

      await expect(forumPostService.create(createForumPostDto)).rejects.toThrow(
        new NotFoundException('Forum Category provided is not valid'),
      );
    });

    it('should throw an exception when the save operation fails', async () => {
      const jobSeekerId = '1';
      const forumCategoryId = 1;
      const createForumPostDto = {
        forumPostTitle: 'New Forum Post',
        createdAt: new Date('2023-10-10'),
        forumPostMessage: 'This is the content of the new post',
        isAnonymous: false,
        forumPostStatus: ForumPostEnum.Pending,
        jobSeekerId,
        forumCategoryId,
      };

      const jobSeeker = new JobSeeker({ userId: jobSeekerId });
      const forumCategory = new ForumCategory({
        forumCategoryId: forumCategoryId,
      });

      jest
        .spyOn(jobSeekerRepository, 'findOneBy')
        .mockResolvedValueOnce(jobSeeker);
      jest
        .spyOn(forumCategoryRepository, 'findOneBy')
        .mockResolvedValueOnce(forumCategory);
      jest
        .spyOn(forumPostRepository, 'save')
        .mockRejectedValueOnce(new Error('Database error'));

      await expect(forumPostService.create(createForumPostDto)).rejects.toThrow(
        new HttpException('Database error', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of forum posts', async () => {
      const jobSeeker = new JobSeeker({ userId: '1' });
      const forumCategory1 = new ForumCategory({
        forumCategoryId: 1,
        isArchived: false,
      });

      const forumComment1 = new ForumComment({
        forumCommentId: 1,
      });

      const forumComment2 = new ForumComment({
        forumCommentId: 2,
      });

      const forumPost1 = new ForumPost({
        forumPostId: 1,
        jobSeeker: jobSeeker,
        forumCategory: forumCategory1,
        forumPostStatus: ForumPostEnum.Reported,
        forumComments: [forumComment1],
      });

      const forumPost2 = new ForumPost({
        forumPostId: 2,
        jobSeeker: jobSeeker,
        forumCategory: forumCategory1,
        forumPostStatus: ForumPostEnum.Active,
        forumComments: [forumComment2],
      });
      const mockForumPosts = [forumPost1, forumPost2];

      jest.spyOn(forumPostRepository, 'find').mockResolvedValue(mockForumPosts);

      const result = await forumPostService.findAll();
      expect(result).toEqual(mockForumPosts);
    });

    it('should throw an HttpException when the find operation fails', async () => {
      jest
        .spyOn(forumPostRepository, 'find')
        .mockRejectedValueOnce(new Error('Database error'));

      await expect(forumPostService.findAll()).rejects.toThrow(
        new HttpException('Database error', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('findOne', () => {
    it('should return a single forum post', async () => {
      const forumPostId = 1;
      const jobSeeker = new JobSeeker({ userId: '1' });
      const mockForumPost = new ForumPost({
        forumPostId: forumPostId,
        jobSeeker: jobSeeker,
      });

      jest
        .spyOn(forumPostRepository, 'findOne')
        .mockResolvedValue(mockForumPost);

      const result = await forumPostService.findOne(forumPostId);
      expect(result).toEqual(mockForumPost);
    });

    it('should throw an HttpException when the findOne operation fails', async () => {
      const forumPostId = 1;
      jest
        .spyOn(forumPostRepository, 'findOne')
        .mockRejectedValueOnce(new Error('Database error'));

      await expect(forumPostService.findOne(forumPostId)).rejects.toThrow(
        new HttpException('Failed to find forum post', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('findForumPostsByJobSeekerId', () => {
    it('should return an array of forum posts for a valid job seeker ID', async () => {
      const jobSeekerId = 'valid_id';
      const jobSeeker = new JobSeeker({ userId: jobSeekerId });
      const forumCategory1 = new ForumCategory({
        forumCategoryId: 1,
        isArchived: false,
      });

      const forumComment1 = new ForumComment({
        forumCommentId: 1,
      });

      const forumComment2 = new ForumComment({
        forumCommentId: 2,
      });

      const forumComment3 = new ForumComment({
        forumCommentId: 3,
      });
      const forumPost1 = new ForumPost({
        forumPostId: 1,
        jobSeeker: jobSeeker,
        forumCategory: forumCategory1,
        forumPostStatus: ForumPostEnum.Pending,
        forumComments: [forumComment1],
      });
      const forumPost2 = new ForumPost({
        forumPostId: 2,
        jobSeeker: jobSeeker,
        forumCategory: forumCategory1,
        forumPostStatus: ForumPostEnum.Active,
        forumComments: [forumComment2],
      });
      const forumPost3 = new ForumPost({
        forumPostId: 3,
        jobSeeker: jobSeeker,
        forumCategory: forumCategory1,
        forumPostStatus: ForumPostEnum.Reported,
        forumComments: [forumComment3],
      });
      const mockForumPosts = [forumPost1, forumPost2, forumPost3]; // Assuming ForumPost objects are correctly instantiated

      jest.spyOn(jobSeekerRepository, 'findOne').mockResolvedValue(jobSeeker);
      jest.spyOn(forumPostRepository, 'find').mockResolvedValue(mockForumPosts);

      const result = await forumPostService.findForumPostsByJobSeekerId(jobSeekerId);
      expect(result).toEqual(mockForumPosts);
    });

    it('should return an empty array when no forum posts are found for a valid job seeker ID', async () => {
      const jobSeekerId = 'valid_id_no_posts';
      const jobSeeker = new JobSeeker({ userId: jobSeekerId });

      jest.spyOn(jobSeekerRepository, 'findOne').mockResolvedValue(jobSeeker);
      jest.spyOn(forumPostRepository, 'find').mockResolvedValue([]);

      const result =
        await forumPostService.findForumPostsByJobSeekerId(jobSeekerId);
      expect(result).toEqual([]);
    });

    it('should throw NotFoundException if job seeker ID is invalid', async () => {
      const jobSeekerId = 'invalid_id';

      jest.spyOn(jobSeekerRepository, 'findOne').mockResolvedValue(null);

      await expect(
        forumPostService.findForumPostsByJobSeekerId(jobSeekerId),
      ).rejects.toThrow(
        new NotFoundException('Job Seeker Id provided is not valid'),
      );
    });

    it('should throw HttpException on unexpected errors', async () => {
      const jobSeekerId = 'unexpected_error_id';

      jest
        .spyOn(jobSeekerRepository, 'findOne')
        .mockRejectedValue(new Error('Unexpected error'));

      await expect(
        forumPostService.findForumPostsByJobSeekerId(jobSeekerId),
      ).rejects.toThrow(
        new HttpException('Unexpected error', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('findForumPostByForumCategoryId', () => {
    it('should return an array of forum posts for a valid forum category ID', async () => {
      const forumCategoryId = 1;
      const jobSeekerId = '1';
      const jobSeeker = new JobSeeker({ userId: jobSeekerId });

      const mockForumCategory = new ForumCategory({
        forumCategoryId: 1,
        isArchived: false,
      });

      const forumComment1 = new ForumComment({
        forumCommentId: 1,
      });

      const forumComment2 = new ForumComment({
        forumCommentId: 2,
      });

      const forumPost1 = new ForumPost({
        forumPostId: 1,
        jobSeeker: jobSeeker,
        forumCategory: mockForumCategory,
        forumPostStatus: ForumPostEnum.Reported,
        forumComments: [forumComment1],
      });
      const forumPost2 = new ForumPost({
        forumPostId: 2,
        jobSeeker: jobSeeker,
        forumCategory: mockForumCategory,
        forumPostStatus: ForumPostEnum.Active,
        forumComments: [forumComment2],
      });
      const mockForumPosts = [forumPost1, forumPost2];

      jest
        .spyOn(forumCategoryRepository, 'findOne')
        .mockResolvedValue(mockForumCategory);
      jest.spyOn(forumPostRepository, 'find').mockResolvedValue(mockForumPosts);

      const result =
        await forumPostService.findForumPostByForumCategoryId(forumCategoryId);
      expect(result).toEqual(mockForumPosts);
    });

    it('should return an empty array when no forum posts are found for a valid forum category ID', async () => {
      const forumCategoryId = 2;
      const mockForumCategory = new ForumCategory({
        forumCategoryId: 1,
        isArchived: false,
      });

      jest
        .spyOn(forumCategoryRepository, 'findOne')
        .mockResolvedValue(mockForumCategory);
      jest.spyOn(forumPostRepository, 'find').mockResolvedValue([]);

      const result =
        await forumPostService.findForumPostByForumCategoryId(forumCategoryId);
      expect(result).toEqual([]);
    });

    it('should throw NotFoundException if forum category ID is invalid', async () => {
      const forumCategoryId = -1;

      jest.spyOn(forumCategoryRepository, 'findOne').mockResolvedValue(null);

      await expect(
        forumPostService.findForumPostByForumCategoryId(forumCategoryId),
      ).rejects.toThrow(
        new NotFoundException('Forum category Id provided is not valid'),
      );
    });

    it('should throw HttpException on unexpected errors', async () => {
      const forumCategoryId = 3;

      jest
        .spyOn(forumCategoryRepository, 'findOne')
        .mockRejectedValue(new Error('Unexpected error'));

      await expect(
        forumPostService.findForumPostByForumCategoryId(forumCategoryId),
      ).rejects.toThrow(
        new HttpException('Unexpected error', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('deleteOwnForumPostByPostIdAndUserId', () => {
    

    it('should successfully mark a forum post as deleted', async () => {
      const forumPostId = 1;
      const userId = '1';
      const jobSeeker = new JobSeeker({ userId: userId });
      const mockForumPost = new ForumPost({
        forumPostId: forumPostId,
        jobSeeker: jobSeeker,
        forumPostStatus: ForumPostEnum.Active,
      });

      const post = new ForumPost({
        forumPostId: forumPostId,
        jobSeeker: jobSeeker,
        forumPostStatus: ForumPostEnum.Deleted,
      });

      jest
        .spyOn(forumPostRepository, 'findOneBy')
        .mockResolvedValue(mockForumPost);
      jest.spyOn(forumPostRepository, 'save').mockResolvedValue(post);

      const result = await forumPostService.deleteOwnForumPostByPostIdAndUserId(
        forumPostId,
        userId,
      );
      expect(result.forumPostStatus).toEqual(ForumPostEnum.Deleted);
    });

    it('should throw NotFoundException if the forum post is not found', async () => {
      const forumPostId = 1;
      const userId = '1';
      jest.spyOn(forumPostRepository, 'findOneBy').mockResolvedValue(null);

      await expect(
        forumPostService.deleteOwnForumPostByPostIdAndUserId(
          forumPostId,
          userId,
        ),
      ).rejects.toThrow(
        new NotFoundException('Forum Post Id provided is not valid'),
      );
    });

    it('should throw HttpException if there is an error during saving the post', async () => {
      const forumPostId = 1;
      const userId = '1';
      const jobSeeker = new JobSeeker({ userId: userId });
      const mockForumPost = new ForumPost({
        forumPostId: forumPostId,
        jobSeeker: jobSeeker,
        forumPostStatus: ForumPostEnum.Active,
      });

      jest
        .spyOn(forumPostRepository, 'findOneBy')
        .mockResolvedValue(mockForumPost);
      jest
        .spyOn(forumPostRepository, 'save')
        .mockRejectedValue(new Error('Failed to delete a forum post'));

      await expect(
        forumPostService.deleteOwnForumPostByPostIdAndUserId(
          forumPostId,
          userId,
        ),
      ).rejects.toThrow(
        new HttpException(
          'Failed to delete a forum post',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

   describe('updateForumPostToReported', () => {
     it('should successfully update a forum post status to Reported', async () => {
       const forumPostId = 1;
       const mockForumPost = new ForumPost({
         forumPostId: forumPostId,
         forumPostStatus: ForumPostEnum.Active,
       });

       const post = new ForumPost({
         forumPostId: forumPostId,
         forumPostStatus: ForumPostEnum.Reported,
       });
      jest
         .spyOn(forumPostRepository, 'findOneBy')
         .mockResolvedValue(mockForumPost);
       jest.spyOn(forumPostRepository, 'save').mockResolvedValue(post);

       const result =
         await forumPostService.updateForumPostToReported(forumPostId);
       expect(result.forumPostStatus).toEqual(ForumPostEnum.Reported);
       expect(forumPostRepository.save).toHaveBeenCalledWith(mockForumPost);
     });

     it('should throw NotFoundException if the forum post is not found', async () => {
       const forumPostId = 1;
       const mockForumPost = new ForumPost({
         forumPostId: forumPostId,
         forumPostStatus: ForumPostEnum.Active,
       });
      jest
        .spyOn(forumPostRepository, 'findOneBy')
        .mockResolvedValue(
          null,
        );

       await expect(
         forumPostService.updateForumPostToReported(forumPostId),
       ).rejects.toThrow(
         new NotFoundException('Forum Post Id provided is not valid'),
       );
     });

     it('should throw HttpException if there is an error during saving the post', async () => {
       const forumPostId = 1;
       const mockForumPost = new ForumPost({
         forumPostId: forumPostId,
         forumPostStatus: ForumPostEnum.Active,
       });
      jest
         .spyOn(forumPostRepository, 'findOneBy')
         .mockResolvedValue(mockForumPost);
       jest
         .spyOn(forumPostRepository, 'save')
         .mockRejectedValue(
           new Error('Failed to update this forum post to Reported'),
         );

       await expect(
         forumPostService.updateForumPostToReported(forumPostId),
       ).rejects.toThrow(
         new HttpException(
           'Failed to update this forum post to Reported',
           HttpStatus.BAD_REQUEST,
         ),
       );
     });
   });

    // describe('update', () => {
    //   const forumPostId = 1;
    //   const mockForumPost = new ForumPost({
    //     /* Initialize with expected properties */
    //   });

    //   it('should successfully update a forum post', async () => {
    //     const updateForumPostDto =
    //       new UpdateForumPostDto(/* fill with valid update data */);
    //     jest
    //       .spyOn(forumPostRepository, 'findOneBy')
    //       .mockResolvedValue(mockForumPost);
    //     jest
    //       .spyOn(forumPostRepository, 'save')
    //       .mockImplementation(async (post) => post);

    //     const result = await service.update(forumPostId, updateForumPostDto);

    //     expect(forumPostRepository.findOneBy).toHaveBeenCalledWith({
    //       forumPostId,
    //     });
    //     expect(forumPostRepository.save).toHaveBeenCalledWith({
    //       ...mockForumPost,
    //       ...updateForumPostDto,
    //     });
    //     expect(result).toMatchObject(updateForumPostDto); // assuming you are updating fields included in UpdateForumPostDto
    //   });

    //   it('should throw NotFoundException if the forum post is not found', async () => {
    //     jest.spyOn(forumPostRepository, 'findOneBy').mockResolvedValue(null);

    //     await expect(
    //       service.update(forumPostId, new UpdateForumPostDto()),
    //     ).rejects.toThrow(
    //       new NotFoundException('Forum Post Id provided is not valid'),
    //     );
    //   });

    //   it('should throw HttpException if there is an error during the update', async () => {
    //     const updateForumPostDto =
    //       new UpdateForumPostDto(/* fill with valid update data */);
    //     jest
    //       .spyOn(forumPostRepository, 'findOneBy')
    //       .mockResolvedValue(mockForumPost);
    //     jest
    //       .spyOn(forumPostRepository, 'save')
    //       .mockRejectedValue(new Error('Unexpected error'));

    //     await expect(
    //       service.update(forumPostId, updateForumPostDto),
    //     ).rejects.toThrow(
    //       new HttpException('Unexpected error', HttpStatus.BAD_REQUEST),
    //     );
    //   });
    // });
});
