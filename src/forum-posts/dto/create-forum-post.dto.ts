import ForumCategoryEnum from 'src/enums/forumCategory.enum';

export class CreateForumPostDto {
  forumPostTitle: string;
  createdAt: Date;
  forumPostMessage: string;
  isAnonymous: boolean;
  forumCategoryId: number;
  jobSeekerId: string; // Parent relationship
}
