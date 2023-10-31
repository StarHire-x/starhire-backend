import { Module } from '@nestjs/common';
import { CommissionService } from './commission.service';
import { CommissionController } from './commission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Commission } from '../entities/commission.entity';
import { Recruiter } from '../entities/recruiter.entity';
import { JobApplication } from '../entities/jobApplication.entity';
import { Administrator } from '../entities/administrator.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Commission,
      Recruiter,
      Administrator,
      JobApplication,
    ]),
  ],
  controllers: [CommissionController],
  providers: [CommissionService],
})
export class CommissionModule {}
