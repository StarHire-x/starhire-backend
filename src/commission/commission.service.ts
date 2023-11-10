import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommissionDto } from './dto/create-commission.dto';
import { UpdateCommissionDto } from './dto/update-commission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Commission } from '../entities/commission.entity';
import { Repository } from 'typeorm';
import { JobApplication } from '../entities/jobApplication.entity';
import { Recruiter } from '../entities/recruiter.entity';
import { Administrator } from '../entities/administrator.entity';
import CommissionStatusEnum from '../enums/commissionStatus.enum';

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
    @InjectRepository(Administrator)
    private readonly adminRepository: Repository<Administrator>,
  ) {}

  async create(createCommissionDto: CreateCommissionDto) {
    try {
      const {
        jobApplicationIds,
        recruiterId,
        administratorId,
        ...dtoExcludingParentIds
      } = createCommissionDto;

      const jobApplications = [];
      for (let id of jobApplicationIds) {
        const jobApplication = await this.jobApplicationRepository.findOne({
          where: { jobApplicationId: id },
        });
        if (!jobApplication) {
          throw new NotFoundException(
            `Job Application Id ${id} provided is not valid`,
          );
        }
        jobApplications.push(jobApplication);
      }

      const recruiter = await this.recruiterRepository.findOne({
        where: { userId: recruiterId },
      });
      if (!recruiter) {
        throw new NotFoundException('Invalid Recruiter Id provided');
      }

      const administrator = await this.adminRepository.findOne({
        where: { userId: administratorId },
      });
      if (!administrator) {
        throw new NotFoundException('Invalid Admin Id provided');
      }

      const commission = new Commission({
        ...dtoExcludingParentIds,
        jobApplications,
        recruiter,
        administrator,
      });

      commission.commissionStatus = CommissionStatusEnum.INDICATED_PAID;
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

  async findAllByRecruiterIdAndAdminId(recruiterId: string, adminId: string) {
    try {
      const commissions = await this.commissionRepository.find({
        where: {
          recruiter: { userId: recruiterId },
          administrator: { userId: adminId },
        },
        relations: { jobApplications: { jobListing: true } },
      });

      if (commissions.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Retrieved commissions',
          data: commissions,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'No commission is found for recruiter and admin',
        };
      }
    } catch (err) {
      throw new HttpException(
        'Failed to retrieve commmissions by recruiter id',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: number) {
    return await this.commissionRepository.findOne({
      where: { commissionId: id },
      relations: {
        recruiter: true,
        administrator: true,
        jobApplications: { commission: true },
      },
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
      const commissionToDelete = await this.findOne(id);
      const jobApplications = commissionToDelete.jobApplications;
      for (let i = 0; i < jobApplications.length; i++) {
        const jobApplication = jobApplications[i];
        jobApplication.commission = null;
        await this.jobApplicationRepository.save(jobApplication);
      }
      return await this.commissionRepository.delete({ commissionId: id });
    } catch (err) {
      throw new HttpException(
        'Failed to delete commission',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getAllRecruiterCommissions() {
    try {
      const allRecruiters = await this.recruiterRepository.find({
        relations: {commissions: true},
      });

      const overallStatistics = {
        notPaidSum: 0,
        notPaidCount: 0,
        indicatedPaidSum: 0,
        indicatedPaidCount: 0,
        confirmedPaidSum: 0,
        confirmedPaidCount: 0,
      };

      const formattedResponse = await Promise.all(
        allRecruiters.map((recruiter) => {
          const commissions = recruiter.commissions;

          const statistics = {
            notPaidSum: 0,
            notPaidCount: 0,
            indicatedPaidSum: 0,
            indicatedPaidCount: 0,
            confirmedPaidSum: 0,
            confirmedPaidCount: 0,
          };

          const formattedCommissions = commissions.map((commission) => {
            if (commission.commissionStatus === CommissionStatusEnum.NOT_PAID) {
              statistics.notPaidCount += 1;
              statistics.notPaidSum += commission.commissionAmount;
            } else if (
              commission.commissionStatus ===
              CommissionStatusEnum.INDICATED_PAID
            ) {
              statistics.indicatedPaidCount += 1;
              statistics.indicatedPaidSum += commission.commissionAmount;
            } else if (
              commission.commissionStatus ===
              CommissionStatusEnum.CONFIRMED_PAID
            ) {
              statistics.confirmedPaidCount += 1;
              statistics.confirmedPaidSum += commission.commissionAmount;
            }
            return {
              commissionId: commission.commissionId,
              commissionDate: commission.commissionDate,
              commissionStatus: commission.commissionStatus,
              commissionRate: commission.commissionRate,
              commissionAmount: commission.commissionAmount,
              paymentDocumentURL: commission.paymentDocumentURL,
              recruiterId: recruiter.userId,
              recruiterName: recruiter.fullName,
              profilePictureUrl: recruiter.profilePictureUrl,
            };
          });

          overallStatistics.notPaidSum += statistics.notPaidSum;
          overallStatistics.notPaidCount += statistics.notPaidCount;
          overallStatistics.indicatedPaidCount += statistics.indicatedPaidCount;
          overallStatistics.indicatedPaidSum += statistics.indicatedPaidSum;
          overallStatistics.confirmedPaidCount += statistics.confirmedPaidCount;
          overallStatistics.confirmedPaidSum += statistics.confirmedPaidSum;

          return {
            recruiterId: recruiter.userId,
            recruiterName: recruiter.fullName,
            commissions: formattedCommissions,
            statistics,
          };
        }),
      )
      return {
        statusCode: HttpStatus.OK,
        message: 'Commission statistics retrieved',
        data: {
          overallStatistics: overallStatistics,
          formattedResponse: formattedResponse,
        },
      };
    } catch (err) {
      throw new HttpException('Error in Database', HttpStatus.BAD_REQUEST);
    }
  }
}
