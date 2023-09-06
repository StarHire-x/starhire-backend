import { CreateForumPostDto } from 'src/forum-posts/dto/create-forum-post.dto';
import { CreateJobSeekerDto } from 'src/job-seeker/dto/create-job-seeker.dto';

export class CreateForumCommentDto {
  jobSeekerId: number;
  forumPostId: number;
  createdAt: Date;
  forumCommentMessage: string;
  isAnonymous: boolean;
}
