import ForumCategoryEnum from 'src/enums/forumCategory.enum';
import { CreateForumCommentDto } from 'src/forum-comments/dto/create-forum-comment.dto';

export class CreateForumPostDto {
  forumPostId: number;
  forumCategory: ForumCategoryEnum;
  forumPostTitle: string;
  createdAt: Date;
  forumPostMessage: string;
  isAnonymous: boolean;
  forumComments: CreateForumCommentDto[];
}
