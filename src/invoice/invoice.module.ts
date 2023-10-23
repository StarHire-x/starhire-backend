import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Administrator } from 'src/entities/administrator.entity';
import { Corporate } from 'src/entities/corporate.entity';
import { Invoice } from 'src/entities/invoice.entity';
import { JobApplication } from 'src/entities/jobApplication.entity';
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
