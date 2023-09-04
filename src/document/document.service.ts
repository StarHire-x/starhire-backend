import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from 'src/entities/document.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  async create(createDocumentDto: CreateDocumentDto) {
    try {

      const document = new Document({
        ...createDocumentDto
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
      // For this part, u want the relationship with other entities to show, at most 1 level, no need too detail
      return await this.documentRepository.findOne({
        where: { documentId: id },
        relations: {},
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
