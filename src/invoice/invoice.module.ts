import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { Invoice } from 'src/entities/invoice.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Commission } from 'src/entities/commission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, Commission])],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
