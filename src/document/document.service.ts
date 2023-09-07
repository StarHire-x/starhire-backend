import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from 'src/entities/document.entity';
import { Repository } from 'typeorm';
import { JobApplication } from 'src/entities/jobApplication.entity';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    @InjectRepository(JobApplication)
    private readonly jobApplicationRepository: Repository<JobApplication>,
  ) {}

  async create(createDocumentDto: CreateDocumentDto) {
    try {
      const { jobApplicationId , ...dtoExcludingParentId } = createDocumentDto;

      const jobApplication = await this.jobApplicationRepository.findOneBy({ jobApplicationId: jobApplicationId });
      if (!jobApplication) {
        throw new NotFoundException('Job Application Id provided is not valid');
      }

      const document = new Document({
        ...createDocumentDto,
        jobApplication: jobApplication,
      });

      await this.documentRepository.save(document);

      return await this.findOne(document.documentId);
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
      // For this part, u want the relationship with other entities to show, at most 1 level, no need too detail
      return await this.documentRepository.findOne({
        where: { documentId: id },
        relations: { jobApplication: true },
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

      const { jobApplicationId, ...dtoExcludingParentId } = updateDocumentDto;

      Object.assign(document, dtoExcludingParentId);
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
