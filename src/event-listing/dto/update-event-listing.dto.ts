import { PartialType } from '@nestjs/mapped-types';
import { CreateEventListingDto } from './create-event-listing.dto';

class UpdateDto {
    eventName: string;
    location: string;
    dateAndTime: Date;
    description: string;
    image: string;
}

export class UpdateEventListingDto extends PartialType(UpdateDto) {}
