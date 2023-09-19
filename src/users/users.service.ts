import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { JobSeekerService } from 'src/job-seeker/job-seeker.service';
import { CorporateService } from 'src/corporate/corporate.service';
import { AdministratorService } from 'src/administrator/admin.service';
import { RecruiterService } from 'src/recruiter/recruiter.service';
import UserRoleEnum from 'src/enums/userRole.enum';
import { mapUserRoleToEnum } from 'src/common/mapStringToEnum';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import UserStatusEnum from 'src/enums/userStatus.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jobSeekerService: JobSeekerService,
    private corporateService: CorporateService,
    private adminService: AdministratorService,
    private recruiterService: RecruiterService,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: any) {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 5); // hash password before storing in db
      createUserDto.password = hashedPassword;
      createUserDto.role = mapUserRoleToEnum(createUserDto.role);
      if (createUserDto.role === UserRoleEnum.JOBSEEKER) {
        return await this.jobSeekerService.create(createUserDto);
      } else if (createUserDto.role === UserRoleEnum.ADMINISTRATOR) {
        return await this.adminService.create(createUserDto);
      } else if (createUserDto.role === UserRoleEnum.CORPORATE) {
        return await this.corporateService.create(createUserDto);
      } else if (createUserDto.role === UserRoleEnum.RECRUITER) {
        return await this.recruiterService.create(createUserDto);
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

  // Shoudld return all the users (Job Seekers, company, etc)
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
      console.log(
        '🚀 ~ file: users.service.ts:68 ~ UsersService ~ findAll ~ jobSeekers:',
        jobSeekers,
      );
      const recruiters = recruitersResponse.data;
      console.log(
        '🚀 ~ file: users.service.ts:70 ~ UsersService ~ findAll ~ recruiters:',
        recruiters,
      );
      const corporates = corporatesResponse.data;
      console.log(
        '🚀 ~ file: users.service.ts:72 ~ UsersService ~ findAll ~ corporates:',
        corporates,
      );
      const admins = adminsResponse.data;
      console.log(
        '🚀 ~ file: users.service.ts:74 ~ UsersService ~ findAll ~ admins:',
        admins,
      );

      const mergedData = [
        ...jobSeekers,
        ...recruiters,
        ...corporates,
        ...admins,
      ];

      console.log(mergedData);

      if (mergedData.length > 0) {
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
      role = mapUserRoleToEnum(role);
      if (!role) {
        throw new HttpException(
          'Invalid role specified',
          HttpStatus.BAD_REQUEST,
        );
      }
      // Find the user by email based on the role
      const userService = this.getUserServiceBasedOnRole(role);
      const retrievedUser = (await userService.findByEmail(email)).data;

      if (!retrievedUser) {
        throw new HttpException(
          `User ${email} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      return retrievedUser;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Needs to accept another argument called role, and invoke the method of the corresponding repository
  async findByUserId(userId: string, role: string) {
    try {
      role = mapUserRoleToEnum(role);
      if (role === UserRoleEnum.JOBSEEKER) {
        return await this.jobSeekerService.findByUserId(userId);
      } else if (role === UserRoleEnum.RECRUITER) {
        return await this.recruiterService.findByUserId(userId);
      } else if (role === UserRoleEnum.CORPORATE) {
        return await this.corporateService.findByUserId(userId);
      } else if (role === UserRoleEnum.ADMINISTRATOR) {
        return await this.adminService.findByUserId(userId);
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

  // Needs to accept another argument called role, and invoke the method of the corresponding repository
  async signIn(email: string, passwordProvided: string, role: string) {
    try {
      // Validate and map the user role
      role = mapUserRoleToEnum(role);
      if (!role) {
        throw new HttpException(
          'Invalid role specified',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Find the user by email based on the role
      const userService = this.getUserServiceBasedOnRole(role);
      const retrievedUser = (await userService.findByEmail(email)).data;

      if (!retrievedUser) {
        throw new HttpException(
          `User ${email} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      // check if user is inactive or not
      if (retrievedUser.status === UserStatusEnum.INACTIVE) {
        throw new HttpException(
          `User ${email} account status is Inactive. Please contact our Admin if you want to activate back your account.`,
          HttpStatus.NOT_FOUND,
        );
      }

      // Check the password
      const isPasswordCorrect = await bcrypt.compare(
        passwordProvided,
        retrievedUser.password,
      );

      if (!isPasswordCorrect) {
        throw new HttpException(
          'Incorrect password provided',
          HttpStatus.NOT_FOUND,
        );
      }

      // Generate JWT token
      const payload = {
        sub: retrievedUser.userId,
        username: retrievedUser.userName,
        email: retrievedUser.email,
        role: retrievedUser.role,
      };
      const jwtAccessToken = await this.jwtService.signAsync(payload);

      // Return the user data and JWT token
      const { password, ...retrievedUserWithoutPassword } = retrievedUser;
      return {
        statusCode: HttpStatus.OK,
        message: `User ${email} found`,
        data: retrievedUserWithoutPassword,
        jwtAccessToken: jwtAccessToken,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Helper function to get the appropriate user service based on role
  private getUserServiceBasedOnRole(role: string) {
    switch (role) {
      case UserRoleEnum.JOBSEEKER:
        return this.jobSeekerService;
      case UserRoleEnum.RECRUITER:
        return this.recruiterService;
      case UserRoleEnum.CORPORATE:
        return this.corporateService;
      case UserRoleEnum.ADMINISTRATOR:
        return this.adminService;
      default:
        throw new HttpException(
          'Invalid role specified',
          HttpStatus.BAD_REQUEST,
        );
    }
  }

  // Pass in the role, invoke update method of the corresponding repository
  async update(id: string, updateUserDto: any) {
    try {
      const role = mapUserRoleToEnum(updateUserDto.role);
      if (role === UserRoleEnum.JOBSEEKER) {
        return await this.jobSeekerService.update(id, updateUserDto);
      } else if (role === UserRoleEnum.ADMINISTRATOR) {
        return await this.adminService.update(id, updateUserDto);
      } else if (role === UserRoleEnum.CORPORATE) {
        return await this.corporateService.update(id, updateUserDto);
      } else if (role === UserRoleEnum.RECRUITER) {
        return await this.recruiterService.update(id, updateUserDto);
      }
    } catch (err) {
      throw new HttpException(
        'Failed to update particulars',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string, role: string) {
    try {
      if (mapUserRoleToEnum(role) === UserRoleEnum.JOBSEEKER) {
        return await this.jobSeekerService.remove(id);
      } else if (mapUserRoleToEnum(role) === UserRoleEnum.ADMINISTRATOR) {
        await this.corporateService.remove(id);
      } else if (mapUserRoleToEnum(role) === UserRoleEnum.CORPORATE) {
        return await this.adminService.remove(id);
      } else if (mapUserRoleToEnum(role) === UserRoleEnum.RECRUITER) {
        return await this.recruiterService.remove(id);
      }
    } catch (err) {
      throw new HttpException(
        'Failed to delete job application',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
