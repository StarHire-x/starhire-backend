import { PartialType } from '@nestjs/mapped-types';

class UpdateDto {
  savedOn: Date;
}

export class UpdateSavedJobListingDto extends PartialType(UpdateDto) {}
