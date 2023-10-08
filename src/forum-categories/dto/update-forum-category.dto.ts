import { PartialType } from '@nestjs/mapped-types';

class UpdateDto {
  forumCategoryTitle: string;
  isArchived: boolean;
  forumGuidelines: string;
}

export class UpdateForumCategoryDto extends PartialType(UpdateDto) {}
