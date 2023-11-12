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

  async findAllByRecruiterId(recruiterId: string) {
    try {
      const recruiter = await this.recruiterRepository.findOne({
        where: { userId: recruiterId },
      });
      if (!recruiter) {
        throw new NotFoundException('Recruiter Id provided is not valid');
      }

      return await this.commissionRepository.find({
        where: {
          recruiter: recruiter,
        },
        relations: {
          jobApplications: { jobListing: true, jobSeeker: true },
          administrator: true,
        },
      });

      // if (commissions.length > 0) {
      //   return {
      //     statusCode: HttpStatus.OK,
      //     message: 'Retrieved commissions',
      //     data: commissions,
      //   };
      // } else {
      //   return {
      //     statusCode: HttpStatus.NOT_FOUND,
      //     message: 'No commission is found for recruiter and admin',
      //   };
      // }
    } catch (err) {
      throw new HttpException(
        'Failed to retrieve commmissions by Recruiter Id',
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
        relations: { commissions: true },
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
      );
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

  private obtainDateByDayWeeksMonth() {
    const startDate = new Date('2023-08-27');
    const today = new Date();

    // Array for days
    const dateArrayInDays = [];
    let currentDate = new Date(startDate);
    while (currentDate <= today) {
      const day = currentDate.getDate().toString().padStart(2, '0');
      const month = currentDate
        .toLocaleString('en-us', { month: 'short' })
        .toUpperCase();
      const year = currentDate.getFullYear().toString().slice(-2);
      dateArrayInDays.push(`${day}-${month}-${year}`);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Array for weeks
    const dateArrayByWeek = [];
    currentDate = new Date(startDate);
    while (currentDate <= today) {
      const startDay = currentDate.getDate().toString().padStart(2, '0');
      const startMonth = currentDate
        .toLocaleString('en-us', { month: 'short' })
        .toUpperCase();
      const startYear = currentDate.getFullYear().toString().slice(-2);

      // Calculate the end date of the week
      let endDate = new Date(currentDate);
      endDate.setDate(endDate.getDate() + 6);
      if (endDate > today) {
        endDate = today;
      }

      const endDay = endDate.getDate().toString().padStart(2, '0');
      const endMonth = endDate
        .toLocaleString('en-us', { month: 'short' })
        .toUpperCase();
      const endYear = endDate.getFullYear().toString().slice(-2);

      // Add the week to the array
      dateArrayByWeek.push(
        `${startDay}-${startMonth}-${startYear} to ${endDay}-${endMonth}-${endYear}`,
      );

      // Increment the date
      currentDate.setDate(currentDate.getDate() + 7);
    }

    // Array for months
    const dateArrayInMonths = [];
    currentDate = new Date(startDate);
    while (currentDate <= today) {
      const month = currentDate
        .toLocaleString('en-us', { month: 'short' })
        .toUpperCase();
      const year = currentDate.getFullYear().toString().slice(-2);
      const monthYear = `${month}-${year}`;
      if (!dateArrayInMonths.includes(monthYear)) {
        dateArrayInMonths.push(monthYear);
      }
      currentDate.setDate(1); // Set to the 1st to prevent rollover
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return {
      dateArrayInDays,
      dateArrayByWeek,
      dateArrayInMonths,
    };
  }

  private formatDateByMonth(isoString) {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const date = new Date(isoString);
    const month = months[date.getMonth()].toUpperCase();
    const year = date.getFullYear().toString().slice(-2);
    return `${month}-${year}`;
  }

  private formatDateByDay(isoString) {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const date = new Date(isoString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()].toUpperCase();
    const year = date.getFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;
  }

  private formatDateByWeek(isoString, reference) {
    const targetDate = new Date(isoString);

    for (let range of reference) {
      const [start, end] = range.split(' to ');
      const startDate = this.parseDate(start);
      const endDate = this.parseDate(end);

      if (targetDate >= startDate && targetDate <= endDate) {
        return range;
      }
    }

    return 'Date out of range';
  }

  private parseDate(dateString) {
    const [day, month, year] = dateString.split('-');
    const months = {
      JAN: 0,
      FEB: 1,
      MAR: 2,
      APR: 3,
      MAY: 4,
      JUN: 5,
      JUL: 6,
      AUG: 7,
      SEP: 8,
      OCT: 9,
      NOV: 10,
      DEC: 11,
    };
    return new Date(
      global.Number(`20${year}`),
      months[month],
      global.Number(day),
    );
  }

  async getOneRecruiterCommissions(userId: string) {
    try {
      const recruiter = await this.recruiterRepository.findOne({
        where: { userId: userId },
        relations: ['commissions'],
      });

      const statisticsMetrics = {
        notPaidSum: 0,
        notPaidCount: 0,
        indicatedPaidSum: 0,
        indicatedPaidCount: 0,
        confirmedPaidSum: 0,
        confirmedPaidCount: 0,
      };

      let statistics = {
        Not_Paid: {},
        Indicated_Paid: {},
        Confirmed_Paid: {},
      };

      const result = this.obtainDateByDayWeeksMonth();
      const month = result.dateArrayInMonths;
      const day = result.dateArrayInDays;
      const weeks = result.dateArrayByWeek;

      for(const commission of recruiter.commissions) {
        const monthSum = this.formatDateByMonth(commission.commissionDate);
        const daySum = this.formatDateByDay(commission.commissionDate);
        const weekSum = this.formatDateByWeek(commission.commissionDate, weeks);

        const status = commission.commissionStatus;

        if (status === CommissionStatusEnum.NOT_PAID) {
          statisticsMetrics.notPaidCount += 1;
          statisticsMetrics.notPaidSum += commission.commissionAmount;
        } else if (status === CommissionStatusEnum.INDICATED_PAID) {
          statisticsMetrics.indicatedPaidCount += 1;
          statisticsMetrics.indicatedPaidSum += commission.commissionAmount;
        } else if (status === CommissionStatusEnum.CONFIRMED_PAID) {
          statisticsMetrics.confirmedPaidCount += 1;
          statisticsMetrics.confirmedPaidSum += commission.commissionAmount;
        }

        statistics[status][monthSum] =
          (statistics[status][monthSum] || 0) + commission.commissionAmount;
        statistics[status][daySum] =
          (statistics[status][daySum] || 0) + commission.commissionAmount;
        statistics[status][weekSum] =
          (statistics[status][weekSum] || 0) + commission.commissionAmount;
      }

      const overallStatistics = {
        overall: statisticsMetrics,
        month: {
          label: month,
          dataNotPaid: month.map(
            (label: string) => statistics.Not_Paid[label] || 0,
          ),
          dataIndicatedPaid: month.map(
            (label: string) => statistics.Indicated_Paid[label] || 0,
          ),
          dataConfirmedPaid: month.map(
            (label: string) => statistics.Confirmed_Paid[label] || 0,
          ),
        },
        day: {
          label: day,
          dataNotPaid: day.map(
            (label: string) => statistics.Not_Paid[label] || 0,
          ),
          dataIndicatedPaid: day.map(
            (label: string) => statistics.Indicated_Paid[label] || 0,
          ),
          dataConfirmedPaid: day.map(
            (label: string) => statistics.Confirmed_Paid[label] || 0,
          ),
        },
        week: {
          label: weeks,
          dataNotPaid: weeks.map(
            (label: string) => statistics.Not_Paid[label] || 0,
          ),
          dataIndicatedPaid: weeks.map(
            (label: string) => statistics.Indicated_Paid[label] || 0,
          ),
          dataConfirmedPaid: weeks.map(
            (label: string) => statistics.Confirmed_Paid[label] || 0,
          ),
        },
      };

      return {
        statusCode: HttpStatus.OK,
        message: 'Invocie detailed statistics retrieved',
        data: overallStatistics,
      };
    } catch (error) {
      throw new HttpException('Error in Database', HttpStatus.BAD_REQUEST);
    }
  }
}
