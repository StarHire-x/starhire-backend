import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Recruiter } from '../entities/recruiter.entity';
import { Repository } from 'typeorm';
import { RecruiterDetailDto } from './dto/recruiter-detail.dto';
import { UpdateRecruiterDto } from './dto/update-recruiter.dto';

@Injectable()
export class RecruiterRepo {
  constructor(
    @InjectRepository(Recruiter)
    private recruiterRepository: Repository<Recruiter>,
  ) {}

  async findAllRecruiters(): Promise<Recruiter[]> {
    return this.recruiterRepository.find();
  }

  async findOneRecruiter(userId: number): Promise<Recruiter> {
    return await this.recruiterRepository.findOneBy({ userId: userId });
  }

  async createRecruiter(
    recruiterDetails: RecruiterDetailDto,
  ): Promise<Recruiter> {
    const newRecruiter = this.recruiterRepository.create({
      ...recruiterDetails,
      createdAt: new Date(),
    });
    return this.recruiterRepository.save(newRecruiter);
  }

  async deleteRecruiter(userId: number): Promise<void> {
    const recruiter = await this.recruiterRepository.findOneBy({
      userId: userId,
    });
    await this.recruiterRepository.remove(recruiter);
  }

  async updateRecruiter(
    userId: number,
    userDetails: UpdateRecruiterDto,
  ): Promise<Recruiter> {
    const updateResult = await this.recruiterRepository.update(
      { userId },
      { ...userDetails },
    );
    const updatedRecruiter: Recruiter =
      await this.recruiterRepository.findOneBy({ userId: userId });
    return updatedRecruiter;
  }
}
