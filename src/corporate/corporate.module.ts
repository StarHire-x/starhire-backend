import { Module } from '@nestjs/common';
import { CorporateService } from './corporate.service';
import { CorporateController } from './corporate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Corporate } from '../entities/corporate.entity';
import { JobSeeker } from 'src/entities/jobSeeker.entity';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([Corporate,JobSeeker])],
  controllers: [CorporateController],
  providers: [CorporateService, EmailService],
})
export class CorporateModule {}


