import { PartialType } from '@nestjs/mapped-types';
import { CreateEventListingDto } from './create-event-listing.dto';

export class UpdateEventListingDto extends PartialType(CreateEventListingDto) {}
