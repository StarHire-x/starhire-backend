import { CreateEventRegistrationDto } from '../../event-registration/dto/create-event-registration.dto';
import EventListingStatusEnum from '../../enums/eventListingStatus.enum';

export class CreateEventListingDto {
  corporateId: string; // Parent relationship
  eventName: string;
  location: string;
  eventDate: Date;
  details: string;
  image: string;
  listingDate: Date;
  eventListingStatus: EventListingStatusEnum;
}
