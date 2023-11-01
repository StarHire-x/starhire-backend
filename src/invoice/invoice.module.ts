import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Administrator } from '../entities/administrator.entity';
import { Corporate } from '../entities/corporate.entity';
import { Invoice } from '../entities/invoice.entity';
import { JobApplication } from '../entities/jobApplication.entity';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Invoice,
      Corporate,
      Administrator,
      JobApplication,
    ]),
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
