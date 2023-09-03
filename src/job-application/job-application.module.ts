import { Module } from '@nestjs/common';
import { JobApplicationService } from './job-application.service';
import { JobApplicationController } from './job-application.controller';
import { JobApplication } from 'src/entities/jobApplication.entity';
import { Document } from 'src/entities/document.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([JobApplication, Document])],
  controllers: [JobApplicationController],
  providers: [JobApplicationService],
})
export class JobApplicationModule {}
