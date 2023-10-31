import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { Document } from '../entities/document.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobApplication } from '../entities/jobApplication.entity';
import { Ticket } from '../entities/ticket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Document, JobApplication, Ticket])],
  controllers: [DocumentController],
  providers: [DocumentService],
})
export class DocumentModule {}
