export class CreateInvoiceDto {
  invoiceDate: Date;
  dueDate: Date;
  billingAddress: string;
  totalAmount: number;
  paid: boolean;
  // Parent Id
  commissionIds: number[];
}
