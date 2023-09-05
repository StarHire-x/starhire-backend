import { CreateForumPostDto } from "src/forum-posts/dto/create-forum-post.dto";
import { CreateJobSeekerDto } from "src/job-seeker/dto/create-job-seeker.dto";

export class CreateForumCommentDto {
  forumCommentId: number;
  createdAt: Date;
  forumCommentMessage: string;
  isAnonymous: boolean;
  jobSeeker: CreateJobSeekerDto;
  forumPost: CreateForumPostDto;
}
