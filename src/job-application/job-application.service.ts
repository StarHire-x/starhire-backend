import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { UpdateJobApplicationDto } from './dto/update-job-application.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JobApplication } from 'src/entities/jobApplication.entity';
import { Repository } from 'typeorm';
import { Document } from 'src/entities/document.entity';
import JobApplicationStatusEnum from 'src/enums/jobApplicationStatus.enum';

@Injectable()
export class JobApplicationService {
  constructor(
    @InjectRepository(JobApplication)
    private readonly jobApplicationRepository: Repository<JobApplication>,
  ) {}

  async create(createJobApplicationDto: CreateJobApplicationDto) {
    try {
      const { documents, ...dtoWithoutDocuments } = createJobApplicationDto;

      const jobApplication = new JobApplication({
        ...dtoWithoutDocuments,
      });

      // Enum not working :(
      jobApplication.jobApplicationStatus = JobApplicationStatusEnum.SUBMITTED;

      if (createJobApplicationDto.documents.length > 0) {
        const createDocuments = createJobApplicationDto.documents.map(
          (createDocumentDto) => new Document(createDocumentDto),
        );

        jobApplication.documents = createDocuments;
      }

      await this.jobApplicationRepository.save(jobApplication);
    } catch (err) {
      throw new HttpException(
        'Failed to create new job application',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    return this.jobApplicationRepository.find();
  }

  async findOne(id: number) {
    try {
      return this.jobApplicationRepository.findOne({
        where: { jobApplicationId: id },
        relations: { documents: true },
      });
    } catch (err) {
      throw new HttpException(
        'Failed to find job application',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: number, updateJobApplicationDto: UpdateJobApplicationDto) {
    try {
      const jobApplication = await this.jobApplicationRepository.findOneBy({
        jobApplicationId: id,
      });

      const { documents, ...dtoWithoutDocuments } = updateJobApplicationDto;

      Object.assign(jobApplication, dtoWithoutDocuments);

      if (documents) {
        const updatedDocuments = updateJobApplicationDto.documents.map(
          (createDocumentDto) => new Document(createDocumentDto),
        );
        jobApplication.documents = updatedDocuments;
      }
      await this.jobApplicationRepository.save(jobApplication);
    } catch (err) {
      throw new HttpException(
        'Failed to update job application',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: number) {
    try {
      await this.jobApplicationRepository.delete({ jobApplicationId: id });
    } catch (err) {
      throw new HttpException(
        'Failed to delete job application',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
