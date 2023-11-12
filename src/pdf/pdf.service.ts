import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { JobSeeker } from 'src/entities/jobSeeker.entity';

export type buyerDetails = {
  name: string;
  address?: string;
};

export type jobApplication = {
  jobApplicationId: number;
  jobListingTitle: string;
  amount: number;
};

export type TInvoiceData = {
  shipping: buyerDetails;
  items: jobApplication[];
  subtotal: number;
  paid: number;
  invoice_nr: number;
};

@Injectable()
export class PdfService {
  async createInvoice(invoice: TInvoiceData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      let buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData); // Resolve the promise with the PDF data
      });
      doc.on('error', (error) => {
        reject(error); // Reject the promise on error
      });

      // Call your methods to add content to the PDF here
      this.generateHeader(doc);
      this.generateCustomerInformation(doc, invoice);
      this.generateInvoiceTable(doc, invoice);
      this.generateFooter(doc);

      // Finalize the PDF file
      doc.end();
    });
  }

  async createResume(jobSeeker: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      let buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData); // Resolve the promise with the PDF data
      });
      doc.on('error', (error) => {
        reject(error); // Reject the promise on error
      });

      // Call your methods to add content to the PDF here
      this.generateResumeHeader(doc, jobSeeker);
      this.generateEducationExperience(doc, jobSeeker);
      this.generateSkill(doc, jobSeeker);
      this.generateWorkExperience(doc, jobSeeker);

      // Finalize the PDF file
      doc.end();
    });
  }

  private generateResumeHeader(doc, jobSeeker: any) {
    doc
      .fillColor('#444444')
      .fontSize(30)
      .text(jobSeeker.fullName, 75, 50, { align: 'center' })
      .fontSize(10) // Adjust font size for these details if needed
      .text('Contact No: ' + jobSeeker.contactNo, 50, 80, {
        align: 'left',
      })
      .text('Address: ' + jobSeeker.homeAddress, 75, 80, {
        align: 'center',
      })
      .text('Email: ' + jobSeeker.email, 300, 80, {
        align: 'right',
      })
      .fontSize(15)
      .text('*Auto Generated Resume*', 75, 120, { align: 'center' })
      .moveDown();
  }

  private generateEducationExperience(doc, jobSeeker: any) {
    doc.fillColor('#444444').fontSize(20).text('Education Details', 50, 160);

    this.generateHr(doc, 185);

    const customerInformationTop = 200;

    doc
      .fontSize(10)
      .font('Helvetica')
      .text('Name of Institution: ', 50, customerInformationTop)
      .font('Helvetica-Bold')
      .text(jobSeeker.instituteName, 150, customerInformationTop)
      .font('Helvetica')

      .text('Date of Graduation', 400, customerInformationTop)
      .text(
        this.formatDateString(jobSeeker.dateOfGraduation),
        400,
        customerInformationTop,
        { align: 'right' },
      )

      .text('Highest Education Status: ', 50, customerInformationTop + 15)
      .font('Helvetica-Bold')
      .text(jobSeeker.highestEducationStatus, 200, customerInformationTop + 15)
      .font('Helvetica')
      .moveDown();
    this.generateHr(doc, 245);
  }

  // private generateSkill(doc, jobSeeker: any) {
  //   doc.fillColor('#444444').fontSize(20).text('Skills & Professional Certificates', 50, 300);

  //   this.generateHr(doc, 320);

  //   const customerInformationTop = 330;

  //   doc
  //     .fontSize(10)
  //     .font('Helvetica')
  //     .text('Proficient Languages: ', 50, customerInformationTop)
  //     .font('Helvetica-Bold')
  //     .text(jobSeeker.proficientLanguages, 150, customerInformationTop)
  //     .font('Helvetica')
  //     .text('Teaching Experience ', 50, customerInformationTop + 15)
  //     .font('Helvetica-Bold')
  //     .text(jobSeeker.experience, 150, customerInformationTop + 15)
  //     .font('Helvetica')
  //     .text('Certifications ', 50, customerInformationTop + 30)
  //     .font('Helvetica-Bold')
  //     .text(jobSeeker.certifications, 150, customerInformationTop + 30)
  //     .moveDown();
  //   this.generateHr(doc, 375);
  // }
  private generateSkill(doc, jobSeeker: any) {
    doc
      .fillColor('#444444')
      .fontSize(20)
      .text('Skills & Professional Certificates', 50, 300);

    this.generateHr(doc, 320);

    const customerInformationTop = 330;

    doc
      .fontSize(10)
      .font('Helvetica')
      .text('Proficient Languages: ', 50, customerInformationTop)
      .font('Helvetica-Bold')
      // Replace '_' with ',' in proficientLanguages
      .text(
        jobSeeker.proficientLanguages.replace(/_/g, ', '),
        150,
        customerInformationTop,
      )
      .font('Helvetica')
      .text('Teaching Experience ', 50, customerInformationTop + 15)
      .font('Helvetica-Bold')
      .text(jobSeeker.experience, 150, customerInformationTop + 15)
      .font('Helvetica')
      .text('Certifications ', 50, customerInformationTop + 30)
      .font('Helvetica-Bold')
      // Replace '_' with ',' in certifications
      .text(
        jobSeeker.certifications.replace(/_/g, ', '),
        150,
        customerInformationTop + 30,
      )
      .moveDown();
    this.generateHr(doc, 375);
  }

  private generateWorkExperience(doc, jobSeeker: any) {
    doc
      .font('Helvetica')
      .fillColor('#444444')
      .fontSize(20)
      .text('Work Experience', 50, 410);

    this.generateHr(doc, 430);

    let i;
    const invoiceTableTop = 440;

    let position = invoiceTableTop;

    for (let i = 0; i < jobSeeker.jobExperiences.length; i++) {
      const jobExperience = jobSeeker.jobExperiences[i];

      this.generateJobExperienceRow(
        doc,
        position,
        jobExperience.jobTitle,
        jobExperience.jobDescription,
        jobExperience.employerName,
        this.formatDateString(jobExperience.startDate),
        this.formatDateString(jobExperience.endDate),
      );
      // this.generateHr(doc, position + 40);

      position += 50; // Increment position by 50 for each job experience
    }

    this.generateHr(doc, position);
  }

  // Currently got issue handling images, i want to add star hire logo but cmi
  private generateHeader(doc) {
    doc
      .image('src/images/StarHire_black.png', 30, 35, { width: 200 })
      .fillColor('#444444')
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
      .text(invoice.shipping.address || '', 300, customerInformationTop + 15)
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
      'Job Application ID',
      'Job Listing Title',
      'Amount',
      'Quantity',
      'Line Total',
    );
    this.generateHr(doc, invoiceTableTop + 20);
    doc.font('Helvetica');

    for (i = 0; i < invoice.items.length; i++) {
      const jobApplication = invoice.items[i];
      const position = invoiceTableTop + (i + 1) * 30;
      this.generateTableRow(
        doc,
        position,
        jobApplication.jobApplicationId,
        jobApplication.jobListingTitle,
        this.formatCurrency(jobApplication.amount),
        1,
        this.formatCurrency(jobApplication.amount),
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

  private generateJobExperienceRow(
    doc,
    y,
    jobTitle,
    jobDescription,
    employerName,
    startDate,
    endDate,
  ) {
    const formattedText = jobTitle + ', ' + employerName;
    const dateRange = startDate + ' - ' + endDate;
    doc
      .fontSize(10)
      .text(formattedText, 50, y)
      .text(dateRange, 370, y, { align: 'right' })
      .text(jobDescription, 50, y + 15);
  }

  private generateHr(doc, y) {
    doc
      .strokeColor('#aaaaaa')
      .lineWidth(1)
      .moveTo(50, y)
      .lineTo(550, y)
      .stroke();
  }

  private formatCurrency(dollars) {
    return '$' + dollars.toFixed(2);
  }

  private formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return year + '/' + month + '/' + day;
  }

  private formatDateString(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
}
