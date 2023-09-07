import { PartialType } from '@nestjs/mapped-types';
import { CreateEventRegistrationDto } from './create-event-registration.dto';

class UpdateDto {
    isActive: boolean;
}

export class UpdateEventRegistrationDto extends PartialType(UpdateDto) {}
