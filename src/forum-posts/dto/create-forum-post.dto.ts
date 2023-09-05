import ForumCategoryEnum from 'src/enums/forumCategory.enum';
import { CreateJobSeekerDto } from 'src/job-seeker/dto/create-job-seeker.dto';

export class CreateForumPostDto {
  forumPostId: number;
  forumCategory: ForumCategoryEnum;
  forumPostTitle: string;
  createdAt: Date;
  forumPostMessage: string;
  isAnonymous: boolean;
  jobSeeker: CreateJobSeekerDto;
}
