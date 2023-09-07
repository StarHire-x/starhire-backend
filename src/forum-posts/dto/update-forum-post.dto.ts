import { PartialType } from '@nestjs/mapped-types';
import ForumCategoryEnum from 'src/enums/forumCategory.enum';

class UpdateDto {
  forumPostTitle: string;
  createdAt: Date;
  forumPostMessage: string;
  isAnonymous: boolean;
  forumCategory: ForumCategoryEnum;
}

export class UpdateForumPostDto extends PartialType(UpdateDto) {}
