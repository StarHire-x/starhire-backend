import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommissionDto } from './dto/create-commission.dto';
import { UpdateCommissionDto } from './dto/update-commission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Commission } from 'src/entities/commission.entity';
import { Repository } from 'typeorm';
import { JobApplication } from 'src/entities/jobApplication.entity';
import { Recruiter } from 'src/entities/recruiter.entity';

@Injectable()
export class CommissionService {
  constructor(
    @InjectRepository(Commission)
    private readonly commissionRepository: Repository<Commission>,
    // Parent Entities
    @InjectRepository(JobApplication)
    private readonly jobApplicationRepository: Repository<JobApplication>,
    @InjectRepository(Recruiter)
    private readonly recruiterRepository: Repository<Recruiter>,
  ) {}

  async create(createCommissionDto: CreateCommissionDto) {
    try {
      const { jobApplicationId, recruiterId, ...dtoExcludingParentIds } =
        createCommissionDto;
      const jobApplication = await this.jobApplicationRepository.findOne({
        where: { jobApplicationId: jobApplicationId },
      });
      if (!jobApplication) {
        throw new NotFoundException('Invalid Job Application Id provided');
      }
      const recruiter = await this.recruiterRepository.findOne({
        where: { userId: recruiterId },
      });
      if (!recruiter) {
        throw new NotFoundException('Invalid Recruiter Id provided');
      }

      const commission = new Commission({
        ...dtoExcludingParentIds,
        jobApplication,
        recruiter,
      });
      return await this.commissionRepository.save(commission);
    } catch (err) {
      throw new HttpException(
        'Failed to create new commission',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Returns the recruiter (parent) as well, since the commission document itself is not very meaningful
  async findAll() {
    return await this.commissionRepository.find({
      relations: { recruiter: true },
    });
  }

  async findOne(id: number) {
    return await this.commissionRepository.findOne({
      where: { commissionId: id },
      relations: { recruiter: true, jobApplication: true },
    });
  }

  async update(id: number, updateCommissionDto: UpdateCommissionDto) {
    try {
      const commission = await this.commissionRepository.findOne({
        where: { commissionId: id },
      });
      if (!commission) {
        throw new NotFoundException('Invalid Commission Id provided');
      }
      Object.assign(commission, updateCommissionDto);
      return await this.commissionRepository.save(commission);
    } catch (err) {
      throw new HttpException(
        'Failed to update commission',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: number) {
    try {
      return await this.commissionRepository.delete({ commissionId: id });
    } catch (err) {
      throw new HttpException(
        'Failed to delete commission',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
