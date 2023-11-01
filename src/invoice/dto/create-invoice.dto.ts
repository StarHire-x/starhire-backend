import InvoiceStatusEnum from '../../enums/invoiceStatus.enum';

export class CreateInvoiceDto {
  invoiceDate: Date;
  invoiceStatus: InvoiceStatusEnum;
  dueDate: Date;
  billingAddress: string;
  totalAmount: number;
  administratorId: string;
  corporateId: string;
  jobApplicationIds: number[];
}
