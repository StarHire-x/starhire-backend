import { PartialType } from "@nestjs/mapped-types";
import { CreateCommissionDto } from "src/commission/dto/create-commission.dto";
import { CreateUserDto } from "src/users/dto/create-user.dto";

export class CreateRecruiterDto extends PartialType(CreateUserDto) {
  fullName: string;
  profilePictureUrl: string;
}