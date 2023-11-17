import { PartialType } from '@nestjs/mapped-types';
import InvoiceStatusEnum from '../../enums/invoiceStatus.enum';

class UpdateDto {
  invoiceDate: Date;
  invoiceStatus: InvoiceStatusEnum;
  dueDate: Date;
  billingAddress: string;
  totalAmount: number;
  invoiceLink: string;
  proofOfPaymentLink: string;
  stripePaymentLink: string;
  stripeInvoiceId: string;
}

export class UpdateInvoiceDto extends PartialType(UpdateDto) {}
