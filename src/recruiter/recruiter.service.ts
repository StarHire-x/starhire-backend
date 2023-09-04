import { CreateRecruiterDto } from './dto/create-recruiter.dto';
import { UpdateRecruiterDto } from './dto/update-recruiter.dto';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RecruiterRepo } from './recruiter.repo';
import { QueryFailedError } from 'typeorm';

@Injectable()
export class RecruiterService {
  constructor(private readonly recruiterRepo: RecruiterRepo) {}

  async create(createRecruiterDto: CreateRecruiterDto) {
    try {
      const { ...recruiterDetail } = createRecruiterDto;
      return await this.recruiterRepo.createRecruiter(recruiterDetail);
    } catch (err) {
      throw new ConflictException(
        'Inserting a duplicate entry into the database. Please check your data.',
      );
    }
  }

  async findAll() {
    return await this.recruiterRepo.findAllRecruiters();
  }

  async findOne(id: number) {
    const recruiter = await this.recruiterRepo.findOneRecruiter(id);
    if (recruiter === null) {
      throw new NotFoundException(`User with ID ${id} not found`);
    } else {
      return recruiter;
    }
  }

  async update(id: number, updateRecruiterDto: UpdateRecruiterDto) {
    const user = await this.recruiterRepo.findOneRecruiter(id);
    if (user === null) {
      throw new NotFoundException(
        `User with ID ${id} not found, Update Unsuccessful`,
      );
    } else {
      return await this.recruiterRepo.updateRecruiter(id, updateRecruiterDto);
    }
  }

  async remove(id: number) {
    const user = await this.recruiterRepo.findOneRecruiter(id);
    if (user === null) {
      throw new NotFoundException(
        `User with ID ${id} not found, Delete Unsuccessful`,
      );
    } else {
      return await this.recruiterRepo.deleteRecruiter(id);
    }
  }
}
