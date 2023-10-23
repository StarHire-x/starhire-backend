export class CreateInvoiceDto {
  invoiceDate: Date;
  dueDate: Date;
  billingAddress: string;
  totalAmount: number;
  isPaid: boolean;
  administratorId: string;
  corporateId: string;
  jobApplicationIds: number[];
}
