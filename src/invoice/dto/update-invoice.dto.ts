import { PartialType } from '@nestjs/mapped-types';

class UpdateDto {
  invoiceDate: Date;

  dueDate: Date;

  billingAddress: string;

  totalAmount: number;

  isPaid: boolean;
}

export class UpdateInvoiceDto extends PartialType(UpdateDto) {}
