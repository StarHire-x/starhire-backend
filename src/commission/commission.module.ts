import { Module } from '@nestjs/common';
import { CommissionService } from './commission.service';
import { CommissionController } from './commission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Commission } from 'src/entities/commission.entity';
import { Recruiter } from 'src/entities/recruiter.entity';
import { JobApplication } from 'src/entities/jobApplication.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Commission, Recruiter, JobApplication])],
  controllers: [CommissionController],
  providers: [CommissionService],
})
export class CommissionModule {}
