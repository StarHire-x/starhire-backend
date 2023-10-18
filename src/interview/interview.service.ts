import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { Interview } from './entities/interview.entity';
//import { JobApplication } from 'src/entities/jobApplication.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobApplicationService } from 'src/job-application/job-application.service';

@Injectable()
export class InterviewService {
  constructor(
    @InjectRepository(Interview)
    private readonly interviewRepository: Repository<Interview>,
    private readonly jobApplicationService: JobApplicationService,
  ) {}

  async createInterview(
    createInterviewDto: CreateInterviewDto,
  ): Promise<Interview> {
    try {
      const { jobApplicationId, chosenDates, corporateId } = createInterviewDto;

      // Find the job application first by the ID
      const result =
        await this.jobApplicationService.getJobSeekersByJobApplicatonId(
          jobApplicationId,
        );

      if (result.statusCode === HttpStatus.NOT_FOUND) {
        // Handle the case where the job application is not found
        throw new HttpException(
          'Job Application not found',
          HttpStatus.NOT_FOUND,
        );
      }

      const recruiterId = result.data.recruiter.userId;
      const jobSeekerId = result.data.jobSeeker.userId;

      const interview = new Interview();
      interview.jobApplication = jobApplicationId;
      interview.jobSeeker = jobSeekerId;
      interview.corporate = corporateId;
      interview.recruiter = recruiterId;
      interview.chosenDates = chosenDates;

      return await this.interviewRepository.save(interview);
    } catch (error) {
      console.error(error);

      throw new HttpException(
        'Failed to create interview',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /*

  findAll() {
    return `This action returns all interview`;
  }

  findOne(id: number) {
    return `This action returns a #${id} interview`;
  }

  update(id: number, updateInterviewDto: UpdateInterviewDto) {
    return `This action updates a #${id} interview`;
  }

  remove(id: number) {
    return `This action removes a #${id} interview`;
  }
  */
}
