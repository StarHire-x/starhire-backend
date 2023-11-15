import { PartialType } from '@nestjs/mapped-types';
import EventListingStatusEnum from '../../enums/eventListingStatus.enum';

class UpdateDto {
  eventName: string;
  location: string;
  eventStartDateAndTime: Date;
  eventEndDateAndTime: Date;
  details: string;
  image: string;
  listingDate: Date;
  eventListingStatus: EventListingStatusEnum;
}

export class UpdateEventListingDto extends PartialType(UpdateDto) {}
