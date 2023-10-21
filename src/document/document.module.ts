import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { Document } from 'src/entities/document.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobApplication } from 'src/entities/jobApplication.entity';
import { Ticket } from 'src/entities/ticket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Document, JobApplication, Ticket])],
  controllers: [DocumentController],
  providers: [DocumentService],
})
export class DocumentModule {}
