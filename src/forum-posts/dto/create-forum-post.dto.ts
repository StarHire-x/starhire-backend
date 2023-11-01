import ForumCategoryEnum from '../../enums/forumCategory.enum';
import ForumPostEnum from '../../enums/forumPost.enum';

export class CreateForumPostDto {
  forumPostTitle: string;
  createdAt: Date;
  forumPostMessage: string;
  isAnonymous: boolean;
  forumPostStatus: ForumPostEnum;
  forumCategoryId: number;
  jobSeekerId: string; // Parent relationship
}
