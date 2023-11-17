import ReviewTypeEnum from "../../enums/reviewType.enum";

export class CreateReviewDto {
  jobSeekerId: string;
  corporateId: string;
  description: string;
  startDate: Date;
  endDate: Date;
  submissionDate: Date;
  reviewType: ReviewTypeEnum;
  attitudeJS: number;
  professionalismJS: number;
  passionJS: number;
  benefitsCP: number;
  cultureCP: number;
  growthCP: number;
}
