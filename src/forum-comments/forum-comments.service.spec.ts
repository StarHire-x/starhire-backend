import { Test, TestingModule } from '@nestjs/testing';
import { ForumCommentsService } from './forum-comments.service';
import { ForumComment } from '../entities/forumComment.entity';
import { DeleteResult, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JobSeeker } from '../entities/jobSeeker.entity';
import { ForumPost } from '../entities/forumPost.entity';
import { CreateForumCommentDto } from './dto/create-forum-comment.dto';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { UpdateForumCommentDto } from './dto/update-forum-comment.dto';

describe('ForumCommentsService', () => {
  let forumCommentService: ForumCommentsService;
  let forumCommentRepository: Repository<ForumComment>;
  let jobSeekerRepository: Repository<JobSeeker>;
  let forumPostRepository: Repository<ForumPost>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ForumCommentsService,
        {
          provide: getRepositoryToken(ForumComment),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(JobSeeker),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(ForumPost),
          useClass: Repository,
        },
      ],
    }).compile();

    forumCommentService =
      module.get<ForumCommentsService>(ForumCommentsService);
    forumCommentRepository = module.get<Repository<ForumComment>>(
      getRepositoryToken(ForumComment),
    );
    jobSeekerRepository = module.get<Repository<JobSeeker>>(
      getRepositoryToken(JobSeeker),
    );
    forumPostRepository = module.get<Repository<ForumPost>>(
      getRepositoryToken(ForumPost),
    );
  });
  
  it('should be defined', () => {
    expect(forumCommentService).toBeDefined();
    expect(forumCommentRepository).toBeDefined();
    expect(jobSeekerRepository).toBeDefined();
    expect(forumPostRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a forum comment for a job seeker and forum post that exist and return create forum comment', async () => {
      const createForumCommentDto: CreateForumCommentDto = {
        createdAt: new Date('2023-11-11'),
        forumCommentMessage: "test",
        isAnonymous: true,
        jobSeekerId: '1',
        forumPostId: 1,
      }

      const jobSeeker = new JobSeeker({
        userId: '1'
      })

      const forumPost = new ForumPost({
        forumPostId: 1
      })

      jest
        .spyOn(jobSeekerRepository, 'findOneBy')
        .mockResolvedValueOnce(jobSeeker);

      jest
        .spyOn(forumPostRepository, 'findOneBy')
        .mockResolvedValueOnce(forumPost);

      const forumComment = new ForumComment({
        createdAt: new Date('2023-11-11'),
        forumCommentMessage: 'test',
        isAnonymous: true,
        jobSeeker: jobSeeker,
        forumPost: forumPost,
      });

      jest
        .spyOn(forumCommentRepository, 'save')
        .mockResolvedValueOnce(forumComment);

      const result = await forumCommentService.create(createForumCommentDto);

      expect(result).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'Forum comment has been created',
      });
    });

    it('should throw NotFoundException if job seeker ID does not exist', async () => {
      const createForumCommentDto = {
        createdAt: new Date('2023-11-11'),
        forumCommentMessage: 'test',
        isAnonymous: true,
        jobSeekerId: 'non-existing-id',
        forumPostId: 1,
      };

      jest.spyOn(jobSeekerRepository, 'findOneBy').mockResolvedValueOnce(null);

      await expect(
        forumCommentService.create(createForumCommentDto),
      ).rejects.toThrow(
        new NotFoundException('Job Seeker Id provided is not valid'),
      );
    });

    it('should throw NotFoundException if forum post ID does not exist', async () => {
      const createForumCommentDto = {
        createdAt: new Date('2023-11-11'),
        forumCommentMessage: 'test',
        isAnonymous: true,
        jobSeekerId: '1',
        forumPostId: 1,
      };

      const jobSeeker = new JobSeeker({
        userId: '1',
      });

      jest
        .spyOn(jobSeekerRepository, 'findOneBy')
        .mockResolvedValueOnce(jobSeeker);
      jest.spyOn(forumPostRepository, 'findOneBy').mockResolvedValueOnce(null);

      await expect(
        forumCommentService.create(createForumCommentDto),
      ).rejects.toThrow(
        new NotFoundException('Forum Post Id provided is not valid'),
      );
    });

    it('should throw HttpException when save operation fails', async () => {
      const createForumCommentDto = {
        createdAt: new Date('2023-11-11'),
        forumCommentMessage: 'test',
        isAnonymous: true,
        jobSeekerId: '1',
        forumPostId: 1,
      };

      const jobSeeker = new JobSeeker({
        userId: '1',
      });

      const forumPost = new ForumPost({
        forumPostId: 1,
      });

      jest
        .spyOn(jobSeekerRepository, 'findOneBy')
        .mockResolvedValueOnce(jobSeeker);
      jest
        .spyOn(forumPostRepository, 'findOneBy')
        .mockResolvedValueOnce(forumPost);

      jest
        .spyOn(forumCommentRepository, 'save')
        .mockRejectedValueOnce(new Error('Save operation failed'));

      await expect(
        forumCommentService.create(createForumCommentDto),
      ).rejects.toThrow(
        new HttpException('Save operation failed', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('findAll', () => {
    it('should return all forum comments if there are any', async () => {
       const forumComment1 = new ForumComment({ forumCommentId: 1 });
       const forumComment2 = new ForumComment({ forumCommentId: 2 });
      const forumComments = [forumComment1, forumComment2];

      jest
        .spyOn(forumCommentRepository, 'find')
        .mockResolvedValueOnce(forumComments);

      const result = await forumCommentService.findAll();

      expect(result).toEqual(forumComments);
    });

    it('should throw an HttpException when there is a database error', async () => {
      const error = new Error('Database error');
      jest.spyOn(forumCommentRepository, 'find').mockRejectedValueOnce(error);

      await expect(forumCommentService.findAll()).rejects.toThrow(
        HttpException,
      );
      await expect(forumCommentService.findAll()).rejects.toEqual(
        expect.objectContaining({
          response: 'Failed to retrieve forum comments',
          status: HttpStatus.INTERNAL_SERVER_ERROR,
        }),
      );
    });
  });

  describe('findCommentsByForumPostId', () => {
    it('should return comments for the given forum post ID', async () => {
      const forumPostId = 1;

      const forumPost = new ForumPost({
        forumPostId: forumPostId,
      });
      const comment1 = new ForumComment({
        forumCommentId: 1,
        forumPost: forumPost,
      });
      const comment2 = new ForumComment({
        forumCommentId: 2,
        forumPost: forumPost,
      });
      const comments = [comment1, comment2];

      jest
        .spyOn(forumCommentRepository, 'find')
        .mockResolvedValueOnce(comments);

      const result =
        await forumCommentService.findCommentsByForumPostId(forumPostId);

      expect(result).toEqual(comments);
    });

    it('should throw an HttpException if there is an error finding comments for the given forum post ID', async () => {
      const forumPostId = 1;
      const error = new Error('Database error');
      jest.spyOn(forumCommentRepository, 'find').mockRejectedValueOnce(error);

      await expect(
        forumCommentService.findCommentsByForumPostId(forumPostId),
      ).rejects.toThrow(
        new HttpException(
          `Failed to find forum comments for this forum post id ${forumPostId}`,
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe('findOne', () => {
    it('should return the forum comment with the given ID including job seeker and forum post', async () => {
      const forumCommentId = 1;

      const jobSeeker = new JobSeeker({
        userId: '1'
      })

      const forumPost = new ForumPost({
        forumPostId: 2
      })

      const forumComment = new ForumComment({
        forumCommentId,
        jobSeeker: jobSeeker,
        forumPost: forumPost
      });

      jest
        .spyOn(forumCommentRepository, 'findOne')
        .mockResolvedValueOnce(forumComment);

      const result = await forumCommentService.findOne(forumCommentId);

      expect(result).toEqual(forumComment);
    });

    it('should throw an HttpException when an error occurs', async () => {
      const forumCommentId = 1;
      const error = new Error('Database error');
      jest
        .spyOn(forumCommentRepository, 'findOne')
        .mockRejectedValueOnce(error);

      await expect(forumCommentService.findOne(forumCommentId)).rejects.toThrow(
        new HttpException(
          'Failed to find forum comment',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe('update', () => {
    it('should update a forum comment and return the updated forum comment', async () => {
      const id = 1;
      const updateForumCommentDto: UpdateForumCommentDto = {
        createdAt: new Date('2023-11-11'),
        forumCommentMessage: 'testing',
        isAnonymous: true,
      };

      const existingForumComment = new ForumComment({
        forumCommentId: 1,
        createdAt: new Date('2023-11-11'),
        forumCommentMessage: 'original message',
        isAnonymous: true,
      });

      jest
        .spyOn(forumCommentRepository, 'findOneBy')
        .mockResolvedValueOnce(existingForumComment);
      jest.spyOn(forumCommentRepository, 'save').mockResolvedValueOnce({
        ...existingForumComment,
        ...updateForumCommentDto,
      });

      const result = await forumCommentService.update(
        id,
        updateForumCommentDto,
      );

      expect(result).toEqual({
        ...existingForumComment,
        ...updateForumCommentDto,
      });
    });

    it('should throw NotFoundException if forum comment with given id does not exist', async () => {
      const id = 2;
      const updateForumCommentDto: UpdateForumCommentDto = {
        createdAt: new Date('2023-11-11'),
        forumCommentMessage: 'testing',
        isAnonymous: true,
      };

      jest
        .spyOn(forumCommentRepository, 'findOneBy')
        .mockResolvedValueOnce(null);

      await expect(
        forumCommentService.update(id, updateForumCommentDto),
      ).rejects.toThrow(
        new NotFoundException('Forum comment Id provided is invalid'),
      );
    });

    it('should throw HttpException if there is an error during the update process', async () => {
      const id = 1;
      const updateForumCommentDto: UpdateForumCommentDto = {
        createdAt: new Date('2023-11-11'),
        forumCommentMessage: 'testing',
        isAnonymous: true,
      };

      jest
        .spyOn(forumCommentRepository, 'findOneBy')
        .mockRejectedValueOnce(new Error('Database error'));

      await expect(
        forumCommentService.update(id, updateForumCommentDto),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('remove', () => {
    it('should remove a forum comment and return the result', async () => {
      const id = 1;
      const result = new DeleteResult();
      result.affected = 1;
      result.raw = {};
      jest.spyOn(forumCommentRepository, 'delete').mockResolvedValue(result);
      const response = await forumCommentService.remove(id);
      expect(response).toEqual(result);
    });

    it('should throw a not found exception if forum comment is not found', async () => {
      const id = 1;
      const result = new DeleteResult();
      result.affected = 0;
      result.raw = {};
      jest.spyOn(forumCommentRepository, 'delete').mockResolvedValue(result);
      await expect(forumCommentService.remove(id)).rejects.toThrow(
        new HttpException('Forum comment id not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw a bad request exception if there is a database error', async () => {
      const id = 1;
      jest
        .spyOn(forumCommentRepository, 'delete')
        .mockRejectedValue(new Error('Database error'));
      await expect(forumCommentService.remove(id)).rejects.toThrow(
        new HttpException('Database error', HttpStatus.BAD_REQUEST),
      );
    });
  });




});
