import ForumCategoryEnum from 'src/enums/forumCategory.enum';
import ForumPostEnum from 'src/enums/forumPost.enum';

export class CreateForumPostDto {
  forumPostTitle: string;
  createdAt: Date;
  forumPostMessage: string;
  isAnonymous: boolean;
  forumPostStatus: ForumPostEnum;
  forumCategoryId: number;
  jobSeekerId: string; // Parent relationship
}
