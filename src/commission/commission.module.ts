import { Module } from '@nestjs/common';
import { CommissionService } from './commission.service';
import { CommissionController } from './commission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Commission } from 'src/entities/commission.entity';
import { Recruiter } from 'src/entities/recruiter.entity';
import { Invoice } from 'src/entities/invoice.entity';
import { JobApplication } from 'src/entities/jobApplication.entity';
import { Administrator } from 'src/entities/administrator.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Commission, Invoice, Recruiter, JobApplication, Administrator]),
  ],
  controllers: [CommissionController],
  providers: [CommissionService],
})
export class CommissionModule {}
