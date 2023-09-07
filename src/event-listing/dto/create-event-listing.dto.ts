import { CreateEventRegistrationDto } from "src/event-registration/dto/create-event-registration.dto";

export class CreateEventListingDto {
    corporateId: number // Parent relationship
    eventName: string;
    location: string;
    dateAndTime: Date;
    description: string;
    image: string;
}
