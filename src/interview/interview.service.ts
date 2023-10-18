import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { Interview } from 'src/entities/interview.entity';
//import { JobApplication } from 'src/entities/jobApplication.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobApplicationService } from 'src/job-application/job-application.service';
import { JobSeekerService } from 'src/job-seeker/job-seeker.service';
import { RecruiterService } from 'src/recruiter/recruiter.service';
import { CorporateService } from 'src/corporate/corporate.service';

@Injectable()
export class InterviewService {
  constructor(
    @InjectRepository(Interview)
    private readonly interviewRepository: Repository<Interview>,
    private readonly jobApplicationService: JobApplicationService,
    private readonly jobSeekerService: JobSeekerService,
    private readonly recruiterService: RecruiterService,
    private readonly corporateService: CorporateService,
  ) {}

  async createInterview(createInterviewDto: CreateInterviewDto) {
    try {
      const {
        jobApplicationId,
        firstChosenDates,
        secondChosenDates,
        thirdChosenDates,
        corporateId,
      } = createInterviewDto;

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

      const JobSeeker = await this.jobSeekerService.findByUserId(jobSeekerId);

      const Recruiter = await this.recruiterService.findByUserId(recruiterId);

      const Corporate = await this.corporateService.findByUserId(corporateId);

      const JobApplication =
        await this.jobApplicationService.getJobApplicationById(
          jobApplicationId,
        );

      const interview = new Interview();
      interview.jobSeeker = JobSeeker.data;
      interview.recruiter = Recruiter.data;
      interview.corporate = Corporate.data;
      interview.firstChosenDates = firstChosenDates;
      interview.secondChosenDates = secondChosenDates;
      interview.thirdChosenDates = thirdChosenDates;
      interview.jobApplication = JobApplication.data;

      await this.interviewRepository.save(interview);

      return {
        statusCode: HttpStatus.OK,
        message: 'Interview Request Created',
        data: interview,
      };
    } catch (error) {
      console.error(error);

      throw new HttpException(
        'Failed to create interview',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getInterviewDatesByUserID(userId: string, role: string) {
    try {
      let interviews;

      if (role === 'jobSeeker') {
        interviews = await this.interviewRepository.find({
          where: {
            jobSeeker: {
              userId,
            },
          },
        });
      } else if (role === 'corporate') {
        interviews = await this.interviewRepository.find({
          where: {
            jobSeeker: {
              userId,
            },
          },
        });
      } else if (role === 'recruiter') {
        interviews = await this.interviewRepository.find({
          where: {
            jobSeeker: {
              userId,
            },
          },
        });
      }

      if (interviews.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Interviews found',
          data: interviews,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'No pending interviews found for this user',
        };
      }
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Failed to find interviews',
        HttpStatus.BAD_REQUEST,
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
