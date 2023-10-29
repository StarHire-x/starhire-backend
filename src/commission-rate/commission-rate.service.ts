import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommissionRateDto } from './dto/create-commission-rate.dto';
import { UpdateCommissionRateDto } from './dto/update-commission-rate.dto';
import { Repository } from 'typeorm';
import { CommissionRate } from 'src/entities/commissionRate.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CommissionRateService {
  constructor(
    @InjectRepository(CommissionRate)
    private readonly commissionRateRepository: Repository<CommissionRate>,
  ) {}

  async create(createCommissionRateDto: CreateCommissionRateDto) {
    try {
      const commissionRate = new CommissionRate({ ...createCommissionRateDto });

      await this.commissionRateRepository.save(commissionRate);

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Commission Rate has been created',
      };
    } catch (err) {
      throw new HttpException(
        'Failed to create new commission rate',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  findAll() {
    return this.commissionRateRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} commissionRate`;
  }

  update(id: number, updateCommissionRateDto: UpdateCommissionRateDto) {
    return `This action updates a #${id} commissionRate`;
  }

  remove(id: number) {
    return `This action removes a #${id} commissionRate`;
  }
}
