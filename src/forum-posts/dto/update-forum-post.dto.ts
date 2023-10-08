import { PartialType } from '@nestjs/mapped-types';

class UpdateDto {
  forumPostTitle: string;
  createdAt: Date;
  forumPostMessage: string;
  isAnonymous: boolean;
  forumCategoryId: number;
}

export class UpdateForumPostDto extends PartialType(UpdateDto) {}
