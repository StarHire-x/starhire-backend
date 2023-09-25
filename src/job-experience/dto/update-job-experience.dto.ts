import { PartialType } from '@nestjs/mapped-types';
import { CreateJobExperienceDto } from './create-job-experience.dto';

export class UpdateJobExperienceDto extends PartialType(
  CreateJobExperienceDto,
) {}
