import { PartialType } from '@nestjs/mapped-types';
import EventListingStatusEnum from 'src/enums/eventListingStatus.enum';

class UpdateDto {
  eventName: string;
  location: string;
  eventDate: Date;
  details: string;
  image: string;
  listingDate: Date;
  eventListingStatus: EventListingStatusEnum;
}

export class UpdateEventListingDto extends PartialType(UpdateDto) {}
