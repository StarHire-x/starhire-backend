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

  // If u use multiple entity or such, rmb to update on the module.ts
  async create(createJobApplicationDto: CreateJobApplicationDto) {
    try {
      // This is to filter out the external relationships in the dto object
      const { documents, ...dtoExcludeRelationship } = createJobApplicationDto;

      // Creating JobApplication without the external relationship with other entites esp one to many
      const jobApplication = new JobApplication({
        ...dtoExcludeRelationship,
      });

      jobApplication.jobApplicationStatus = this.mapJsonToEnum(
        dtoExcludeRelationship.jobApplicationStatus,
      );

      // Creating the Classes for external relationship with other entities (OneToMany)
      if (createJobApplicationDto.documents.length > 0) {
        const createDocuments = createJobApplicationDto.documents.map(
          (createDocumentDto) => new Document(createDocumentDto),
        );
        jobApplication.documents = createDocuments;
      }

      return await this.jobApplicationRepository.save(jobApplication);
    } catch (err) {
      throw new HttpException(
        'Failed to create new job application',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    return await this.jobApplicationRepository.find();
  }

  async findOne(id: number) {
    try {
      // For this part, u want the relationship with other entities to show, at most 1 level, no need too detail
      return await this.jobApplicationRepository.findOne({
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

      // This is to filter out the external relationships in the dto object
      const { documents, ...dtoExcludeRelationship } = updateJobApplicationDto;

      Object.assign(jobApplication, dtoExcludeRelationship);

      jobApplication.jobApplicationStatus = this.mapJsonToEnum(
        dtoExcludeRelationship.jobApplicationStatus,
      );

      // Same thing, u also update the entities with relationship as such
      if (documents && documents.length > 0) {
        const updatedDocuments = updateJobApplicationDto.documents.map(
          (createDocumentDto) => new Document(createDocumentDto),
        );
        jobApplication.documents = updatedDocuments;
      }

      return await this.jobApplicationRepository.save(jobApplication);
    } catch (err) {
      throw new HttpException(
        'Failed to update job application',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: number) {
    try {
      return await this.jobApplicationRepository.delete({
        jobApplicationId: id,
      });
    } catch (err) {
      throw new HttpException(
        'Failed to delete job application',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  mapJsonToEnum(status: string): JobApplicationStatusEnum {
    switch (status) {
      case 'Withdraw':
        return JobApplicationStatusEnum.WITHDRAWN;
      case 'Submitted':
        return JobApplicationStatusEnum.SUBMITTED;
      case 'Approved':
        return JobApplicationStatusEnum.ACCEPTED;
      case 'Rejected':
        return JobApplicationStatusEnum.REJECTED;
      default:
        return JobApplicationStatusEnum.PENDING;
    }
  }
}
