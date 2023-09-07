import { PartialType } from '@nestjs/mapped-types';

class UpdateDto {
  createdAt: Date;
  forumCommentMessage: string;
  isAnonymous: boolean;
}

export class UpdateForumCommentDto extends PartialType(UpdateDto) {}
