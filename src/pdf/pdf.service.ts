import { Injectable } from '@nestjs/common';
import { CreatePdfDto } from './dto/create-pdf.dto';
import { UpdatePdfDto } from './dto/update-pdf.dto';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PdfService {
  async createInvoice(invoice, filePath): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      let buffers: Buffer[] = [];
      const stream = fs.createWriteStream(filePath);

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        fs.writeFileSync(filePath, pdfData); // Write the PDF data to a file
        resolve(pdfData); // Resolve the promise with the PDF data
      });
      doc.on('error', (error) => {
        reject(error); // Reject the promise on error
      });

      // Pipe the document to a blob
      doc.pipe(stream);

      // Call your methods to add content to the PDF here
      this.generateHeader(doc);
      this.generateCustomerInformation(doc, invoice);
      this.generateInvoiceTable(doc, invoice);
      this.generateFooter(doc);

      // Finalize the PDF file
      doc.end();
    });
  }


  // Currently got issue handling images, i want to add star hire logo but cmi
  private generateHeader(doc) {
    // const logoPath = path.join(__dirname, 'images', 'StarHire_black.png');
    // console.log(logoPath);
    doc
      // .image(
      //   logoPath,
      //   50,
      //   45,
      //   { width: 50 },
      // )
      .fillColor('#444444')
      .fontSize(20)
      .text('StarHire Inc.', 110, 57, {align: 'left'})
      .fontSize(10)
      .text('StarHire Inc.', 200, 50, { align: 'right' })
      .text('123 Heng Mui Keng Terrace', 200, 65, { align: 'right' })
      .text('Singapore, 310017', 200, 80, { align: 'right' })
      .moveDown();
  }

  private generateCustomerInformation(doc, invoice) {
    doc.fillColor('#444444').fontSize(20).text('Invoice', 50, 160);

    this.generateHr(doc, 185);

    const customerInformationTop = 200;

    doc
      .fontSize(10)
      .text('Invoice Number:', 50, customerInformationTop)
      .font('Helvetica-Bold')
      .text(invoice.invoice_nr, 150, customerInformationTop)
      .font('Helvetica')
      .text('Invoice Date:', 50, customerInformationTop + 15)
      .text(this.formatDate(new Date()), 150, customerInformationTop + 15)
      .text('Balance Due:', 50, customerInformationTop + 30)
      .text(
        this.formatCurrency(invoice.subtotal - invoice.paid),
        150,
        customerInformationTop + 30,
      )

      .font('Helvetica-Bold')
      .text(invoice.shipping.name, 300, customerInformationTop)
      .font('Helvetica')
      .text(invoice.shipping.address, 300, customerInformationTop + 15)
      .text(
        invoice.shipping.city +
          ', ' +
          invoice.shipping.state +
          ', ' +
          invoice.shipping.country,
        300,
        customerInformationTop + 30,
      )
      .moveDown();

    this.generateHr(doc, 252);
  }

  private generateInvoiceTable(doc, invoice) {
    let i;
    const invoiceTableTop = 330;

    doc.font('Helvetica-Bold');
    this.generateTableRow(
      doc,
      invoiceTableTop,
      'Item',
      'Description',
      'Unit Cost',
      'Quantity',
      'Line Total',
    );
    this.generateHr(doc, invoiceTableTop + 20);
    doc.font('Helvetica');

    for (i = 0; i < invoice.items.length; i++) {
      const item = invoice.items[i];
      const position = invoiceTableTop + (i + 1) * 30;
      this.generateTableRow(
        doc,
        position,
        item.item,
        item.description,
        this.formatCurrency(item.amount / item.quantity),
        item.quantity,
        this.formatCurrency(item.amount),
      );

      this.generateHr(doc, position + 20);
    }

    const subtotalPosition = invoiceTableTop + (i + 1) * 30;
    this.generateTableRow(
      doc,
      subtotalPosition,
      '',
      '',
      'Subtotal',
      '',
      this.formatCurrency(invoice.subtotal),
    );

    const paidToDatePosition = subtotalPosition + 20;
    this.generateTableRow(
      doc,
      paidToDatePosition,
      '',
      '',
      'Paid To Date',
      '',
      this.formatCurrency(invoice.paid),
    );

    const duePosition = paidToDatePosition + 25;
    doc.font('Helvetica-Bold');
    this.generateTableRow(
      doc,
      duePosition,
      '',
      '',
      'Balance Due',
      '',
      this.formatCurrency(invoice.subtotal - invoice.paid),
    );
    doc.font('Helvetica');
  }

  private generateFooter(doc) {
    doc
      .fontSize(10)
      .text(
        'Payment is due within 15 days. Thank you for your business.',
        50,
        780,
        { align: 'center', width: 500 },
      );
  }

  private generateTableRow(
    doc,
    y,
    item,
    description,
    unitCost,
    quantity,
    lineTotal,
  ) {
    doc
      .fontSize(10)
      .text(item, 50, y)
      .text(description, 150, y)
      .text(unitCost, 280, y, { width: 90, align: 'right' })
      .text(quantity, 370, y, { width: 90, align: 'right' })
      .text(lineTotal, 0, y, { align: 'right' });
  }

  private generateHr(doc, y) {
    doc
      .strokeColor('#aaaaaa')
      .lineWidth(1)
      .moveTo(50, y)
      .lineTo(550, y)
      .stroke();
  }

  private formatCurrency(cents) {
    return '$' + (cents / 100).toFixed(2);
  }

  private formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return year + '/' + month + '/' + day;
  }
}
