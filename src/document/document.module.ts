import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { Document } from 'src/entities/document.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobApplicationService } from 'src/job-application/job-application.service';
import { JobApplication } from 'src/entities/jobApplication.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Document,JobApplication])],
  controllers: [DocumentController],
  providers: [DocumentService, JobApplicationService],
})
export class DocumentModule {}
