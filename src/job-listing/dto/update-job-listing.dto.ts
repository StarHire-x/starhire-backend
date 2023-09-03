import { PartialType } from '@nestjs/mapped-types';
import { CreateJobListingDto } from './create-job-listing.dto';

export class UpdateJobListingDto extends PartialType(CreateJobListingDto) {}
