import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from 'src/entities/invoice.entity';
import { Repository } from 'typeorm';
import { Commission } from 'src/entities/commission.entity';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(Commission)
    private readonly commissionRepository: Repository<Commission>,
  ) {}
  async create(createInvoiceDto: CreateInvoiceDto) {
    try {
      const { commissionIds, ...dtoExcludingParentId } = createInvoiceDto;
      const commissions = [];
      for (const commissionIdString in commissionIds) {
        const commissionId = Number(commissionIdString);
        const commission = await this.commissionRepository.findOne({
          where: { commissionId: commissionId },
        });
        if (!commission) {
          throw new NotFoundException(
            `Commission ID ${commissionId} is invalid`,
          );
        }
        commissions.push(commission);
      }
      const invoice = new Invoice({
        ...dtoExcludingParentId,
        commissions: commissions,
      });
      return await this.invoiceRepository.save(invoice);
    } catch (err) {
      throw new HttpException(
        'Failed to create new invoice',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    return await this.invoiceRepository.find();
  }

  async findOne(id: number) {
    try {
      return await this.invoiceRepository.findOne({
        where: { invoiceId: id },
        relations: { commissions: true },
      });
    } catch (err) {
      throw new HttpException('Failed to find invoice', HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    try {
      const invoice = await this.invoiceRepository.findOneBy({
        invoiceId: id,
      });
      if (!invoice) {
        throw new NotFoundException('Invoice Id provided is not valid');
      }
      Object.assign(invoice, updateInvoiceDto);
      return await this.invoiceRepository.save(invoice);
    } catch (err) {
      throw new HttpException(
        'Failed to update Invoice',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: number) {
    try {
      return await this.invoiceRepository.delete({ invoiceId: id });
    } catch (err) {
      throw new HttpException(
        'Failed to delete Invoice',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
