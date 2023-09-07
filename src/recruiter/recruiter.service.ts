import { Recruiter } from 'src/entities/recruiter.entity';
import { CreateRecruiterDto } from './dto/create-recruiter.dto';
import { UpdateRecruiterDto } from './dto/update-recruiter.dto';
import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QueryFailedError, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RecruiterService {
  constructor(
    @InjectRepository(Recruiter)
    private readonly recruiterRepo: Repository<Recruiter>,
  ) {}

  async create(createRecruiterDto: CreateRecruiterDto) {
    try {
      const recruiter = new Recruiter({ ...createRecruiterDto });
      return await this.recruiterRepo.save(recruiter);
    } catch (err) {
      throw new HttpException(
        'Failed to create new recruiter',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {}

  async findOne(id: number) {}

  async findByEmail(email: string) {
    try {
      return await this.recruiterRepo.findOne({
        where: { email },
      });
    } catch (err) {
      throw new HttpException('Failed to find admin', HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, updateRecruiterDto: UpdateRecruiterDto) {}

  async remove(id: number) {}
}
