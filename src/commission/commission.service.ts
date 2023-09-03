import { Injectable } from '@nestjs/common';
import { CreateCommissionDto } from './dto/create-commission.dto';
import { UpdateCommissionDto } from './dto/update-commission.dto';

@Injectable()
export class CommissionService {
  create(createCommissionDto: CreateCommissionDto) {
    return 'This action adds a new commission';
  }

  findAll() {
    return `This action returns all commission`;
  }

  findOne(id: number) {
    return `This action returns a #${id} commission`;
  }

  update(id: number, updateCommissionDto: UpdateCommissionDto) {
    return `This action updates a #${id} commission`;
  }

  remove(id: number) {
    return `This action removes a #${id} commission`;
  }
}
