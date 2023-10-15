import { PartialType } from '@nestjs/mapped-types';
import ForumPostEnum from 'src/enums/forumPost.enum';

class UpdateDto {
  forumPostTitle: string;
  createdAt: Date;
  forumPostMessage: string;
  isAnonymous: boolean;
  forumPostStatus: ForumPostEnum;
}

export class UpdateForumPostDto extends PartialType(UpdateDto) {}
