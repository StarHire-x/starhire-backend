import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "src/users/dto/create-user.dto";

export class CreateCorporateDto extends PartialType(CreateUserDto) {
  companyName: string;
  companyRegistrationId: number;
  corporatePicture: string;
  companyAddress: string;
}
