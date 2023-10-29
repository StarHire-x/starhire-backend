import { PartialType } from '@nestjs/mapped-types';
import { CreateCorporateDto } from './create-corporate.dto';
import CorporatePromotionStatusEnum from 'src/enums/corporatePromotionStatus.enum';

export class UpdateCorporateDto extends PartialType(CreateCorporateDto) {
  corporatePromotionStatus: CorporatePromotionStatusEnum;
  stripeCustId: string;
  stripeSubId: string;
}
