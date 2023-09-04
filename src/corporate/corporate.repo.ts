import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Corporate } from '../entities/corporate.entity';
import { Repository } from 'typeorm';
import { CorporateDetailDto } from './dto/corporate-detail.dto';
import { UpdateCorporateDto } from './dto/update-corporate.dto';

@Injectable()
export class CorporateRepo {
  constructor(
    @InjectRepository(Corporate)
    private corporateRepository: Repository<Corporate>,
  ) {}

  async findAllCorporates(): Promise<Corporate[]> {
    return this.corporateRepository.find();
  }

  async findOneCorporate(userId: number): Promise<Corporate> {
    return await this.corporateRepository.findOneBy({ userId: userId });
  }

  async createCorporate(
    corporateDetails: CorporateDetailDto,
  ): Promise<Corporate> {
    const newCorporate = this.corporateRepository.create({
      ...corporateDetails,
      createdAt: new Date(),
    });
    return this.corporateRepository.save(newCorporate);
  }

  async deleteCorporate(userId: number): Promise<void> {
    const corporate = await this.corporateRepository.findOneBy({
      userId: userId,
    });
    await this.corporateRepository.remove(corporate);
  }

  async updateCorporate(
    userId: number,
    userDetails: UpdateCorporateDto,
  ): Promise<Corporate> {
    const updateResult = await this.corporateRepository.update(
      { userId },
      { ...userDetails },
    );
    const updatedCorporate: Corporate =
      await this.corporateRepository.findOneBy({ userId: userId });
    return updatedCorporate;
  }
}
