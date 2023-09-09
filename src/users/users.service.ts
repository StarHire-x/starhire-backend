import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import UserRoleEnum from 'src/enums/userRole.enum';
import { JobSeekerService } from 'src/job-seeker/job-seeker.service';
import { CorporateService } from 'src/corporate/corporate.service';
import { AdministratorService } from 'src/administrator/admin.service';
import { RecruiterService } from 'src/recruiter/recruiter.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jobSeekerService: JobSeekerService,
    private corporateService: CorporateService,
    private adminService: AdministratorService,
    private recruiterService: RecruiterService,
  ) {}

  async create(createUserDto: any) {
    try {
      // Should change to enum
      if (createUserDto.role === 'Job_Seeker') {
        return await this.jobSeekerService.create(createUserDto);
      } else if (createUserDto.role === 'Administrator') {
        return await this.adminService.create(createUserDto);
      } else if (createUserDto.role === 'Corporate') {
        return await this.corporateService.create(createUserDto);
      } else if (createUserDto.role === 'Recruiter') {
        return await this.recruiterService.create(createUserDto);
      }
    } catch (err) {
      throw new HttpException(
        'Failed to create new job application',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Shoudl return all the users (Job Seekers, company, etc)
  // Maybe return just id field, name , role
  async findAll() {
    try {
        const [
          jobSeekersResponse,
          recruitersResponse,
          corporatesResponse,
          adminsResponse,
        ] = await Promise.all([
          this.jobSeekerService.findAll(),
          this.recruiterService.findAll(),
          this.corporateService.findAll(),
          this.adminService.findAll(),
        ]);

        // Assuming each response has a `data` property that you're interested in.
        const jobSeekers = jobSeekersResponse.data;
        console.log("🚀 ~ file: users.service.ts:68 ~ UsersService ~ findAll ~ jobSeekers:", jobSeekers)
        const recruiters = recruitersResponse.data;
        console.log("🚀 ~ file: users.service.ts:70 ~ UsersService ~ findAll ~ recruiters:", recruiters)
        const corporates = corporatesResponse.data;
        console.log("🚀 ~ file: users.service.ts:72 ~ UsersService ~ findAll ~ corporates:", corporates)
        const admins = adminsResponse.data;
        console.log("🚀 ~ file: users.service.ts:74 ~ UsersService ~ findAll ~ admins:", admins)

        const mergedData = [
          ...jobSeekers,
          ...recruiters,
          ...corporates,
          ...admins,
        ];

        console.log(mergedData);

        if(mergedData.length > 0) {
          return {
            statusCode: HttpStatus.OK,
            message: 'User data retrieved',
            data: mergedData,
          };
        } else {
          return {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'User data not retrived',
            data: [],
          };
        }


    } catch (err) {
      throw err;
    }
  }

  async findOneEmail(email: string) {
    try {
      return await this.jobSeekerService.findByEmail(email);
    } catch (err) {
      throw new HttpException(
        'Failed to find job application',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Needs to accept another argument called role, and invoke the method of the corresponding repository
  async findByEmail(email: string, role: string) {
    try {
      if (role === 'Job_Seeker') {
        return await this.jobSeekerService.findByEmail(email);
      } else if (role === 'Recruiter') {
        return await this.recruiterService.findByEmail(email);
      } else if (role === 'Corporate') {
        return await this.corporateService.findByEmail(email);
      } else if (role === 'Administrator') {
        console.log('You hit admin end point');
        return await this.adminService.findByEmail(email);
      } else {
        // Handle the case where none of the roles match
        throw new HttpException(
          'Invalid role specified',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (err) {
      throw err; 
    }
  }

  // Pass in the role, invoke update method of the corresponding repository
  async update(id: number, updateUserDto: any) {
    try {
      const { confirmPassword, ...dtoExcludeRelationship } = updateUserDto;

      if (updateUserDto.password !== updateUserDto.confirmPassword) {
        throw new HttpException(
          'Password are different',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (updateUserDto.role === 'Job_Seeker') {
        return await this.jobSeekerService.update(id, dtoExcludeRelationship);
      } else if (updateUserDto.role === 'Administrator') {
        await this.corporateService.update(id, dtoExcludeRelationship);
      } else if (updateUserDto.role === 'Corporate') {
        return await this.adminService.update(id, dtoExcludeRelationship);
      } else if (updateUserDto.role === 'Recruiter') {
        return await this.recruiterService.update(id, dtoExcludeRelationship);
      }
    } catch (err) {
      throw new HttpException(
        'Failed to update particulars',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: number, role: string) {
    try {
      if (role === 'Job_Seeker') {
        return await this.jobSeekerService.remove(id);
      } else if (role === 'Administrator') {
        await this.corporateService.remove(id);
      } else if (role === 'Corporate') {
        return await this.adminService.remove(id);
      } else if (role === 'Recruiter') {
        return await this.recruiterService.remove(id);
      }
    } catch (err) {
      throw new HttpException(
        'Failed to delete job application',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  mapJsonToEnum(status: string): UserRoleEnum {
    switch (status) {
      case 'Job_Seeker':
        return UserRoleEnum.JOBSEEKER;
      case 'Corporate':
        return UserRoleEnum.CORPORATE;
      case 'Recruiter':
        return UserRoleEnum.RECRUITER;
      case 'Administrator':
        return UserRoleEnum.ADMINISTRATOR;
    }
  }
}
