import { PartialType } from '@nestjs/mapped-types';

class UpdateDto {}

export class UpdateEventRegistrationDto extends PartialType(UpdateDto) {}
