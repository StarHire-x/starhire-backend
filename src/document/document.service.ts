import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from 'src/entities/document.entity';
import { Repository } from 'typeorm';
import { JobApplication } from 'src/entities/jobApplication.entity';
import { Ticket } from 'src/entities/ticket.entity';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    @InjectRepository(JobApplication)
    private readonly jobApplicationRepository: Repository<JobApplication>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) {}

  async create(createDocumentDto: CreateDocumentDto) {
    try {
      const { ...dtoExcludingParentId } = createDocumentDto;

      // const jobApplication = await this.jobApplicationRepository.findOneBy({
      //   jobApplicationId: jobApplicationId,
      // });
      // if (!jobApplication) {
      //   throw new NotFoundException('Job Application Id provided is not valid');
      // }

      const document = new Document({
        ...dtoExcludingParentId,
        // jobApplication: jobApplication,
      });

      return await this.documentRepository.save(document);
    } catch (err) {
      throw new HttpException(
        'Failed to create new document',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    return await this.documentRepository.find();
  }

  async findOne(id: number) {
    try {
      // Returns jobApplication (parent) entity as well
      return await this.documentRepository.findOne({
        where: { documentId: id },
        relations: { jobApplication: true, ticket: true },
      });
    } catch (err) {
      throw new HttpException(
        'Failed to find document',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: number, updateDocumentDto: UpdateDocumentDto) {
    try {
      const document = await this.documentRepository.findOneBy({
        documentId: id,
      });

      if (!document) {
        throw new NotFoundException('Document Id provided is not valid');
      }

      Object.assign(document, updateDocumentDto);
      return await this.documentRepository.save(document);
    } catch (err) {
      throw new HttpException(
        'Failed to update document',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: number) {
    try {
      return await this.documentRepository.delete({
        documentId: id,
      });
    } catch (err) {
      throw new HttpException(
        'Failed to delete document',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
