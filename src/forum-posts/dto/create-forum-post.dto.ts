import ForumCategoryEnum from 'src/enums/forumCategory.enum';

export class CreateForumPostDto {
  forumPostTitle: string;
  createdAt: Date;
  forumPostMessage: string;
  isAnonymous: boolean;
  forumCategory: ForumCategoryEnum;
  jobSeekerId: number; // Parent relationship
}
