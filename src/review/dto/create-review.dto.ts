import StarCategoryEnum from '../../enums/starCategory.enum';

export class CreateReviewDto {
  description: string;
  rating: StarCategoryEnum;
  timestamp: Date;
  corporateId: string;
  jobSeekerId: string;
}
