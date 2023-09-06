import { CreateEventRegistrationDto } from "src/event-registration/dto/create-event-registration.dto";

export class EventListingDetailDto {
    corporateId: number;
    eventName: string;
    location: string;
    dateAndTime: Date;
    description: string;
    image: string;
}
