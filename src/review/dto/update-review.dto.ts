import { PartialType } from '@nestjs/mapped-types';
import StarCategoryEnum from 'src/enums/starCategory.enum';

export class UpdateDto {
  description: string;
  rating: StarCategoryEnum;
  timestamp: Date;
}

export class UpdateReviewDto extends PartialType(UpdateDto) {}
