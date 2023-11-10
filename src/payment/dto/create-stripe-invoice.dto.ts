export class CreateStripeInvoiceDto {
    userId: string;
    email: string;
    companyName: string;
    totalAmount: number;
    invoiceDesc: string;
}