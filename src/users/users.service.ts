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
import { CreateUserDto } from './dto/create-user.dto';
import { Administrator } from 'src/entities/administrator.entity';
import { Recruiter } from 'src/entities/recruiter.entity';
import { JobSeeker } from 'src/entities/jobSeeker.entity';
import { Corporate } from 'src/entities/corporate.entity';
import { Number } from 'twilio/lib/twiml/VoiceResponse';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Administrator)
    private readonly adminRepo: Repository<Administrator>,
    @InjectRepository(Recruiter)
    private readonly recruiterRepo: Repository<Recruiter>,
    @InjectRepository(JobSeeker)
    private readonly jobSeekerRepo: Repository<JobSeeker>,
    @InjectRepository(Corporate)
    private readonly corporateRepo: Repository<Corporate>,
    private jobSeekerService: JobSeekerService,
    private corporateService: CorporateService,
    private adminService: AdministratorService,
    private recruiterService: RecruiterService,
    private jwtService: JwtService,
  ) {}

  // check for duplicate username / email / contact number across all user tables
  async checkForCommonUserDuplicates(createUserDto: CreateUserDto) {
    try {
      // username
      const findUserNameAdmin = await this.adminRepo.findOne({
        where: { userName: createUserDto.userName },
      });

      const findUserNameRecruiter = await this.recruiterRepo.findOne({
        where: { userName: createUserDto.userName },
      });

      const findUserNameJobSeeker = await this.jobSeekerRepo.findOne({
        where: { userName: createUserDto.userName },
      });

      const findUserNameCorporate = await this.corporateRepo.findOne({
        where: { userName: createUserDto.userName },
      });

      if (
        findUserNameAdmin ||
        findUserNameRecruiter ||
        findUserNameJobSeeker ||
        findUserNameCorporate
      ) {
        throw new ConflictException(
          `This username ${createUserDto.userName} has already been used. Please use a different username.`,
        );
      }

      // email
      const findEmailAdmin = await this.adminRepo.findOne({
        where: { email: createUserDto.email },
      });

      const findEmailRecruiter = await this.recruiterRepo.findOne({
        where: { email: createUserDto.email },
      });

      const findEmailJobSeeker = await this.jobSeekerRepo.findOne({
        where: { email: createUserDto.email },
      });

      const findEmailCorporate = await this.corporateRepo.findOne({
        where: { email: createUserDto.email },
      });

      if (
        findEmailAdmin ||
        findEmailRecruiter ||
        findEmailJobSeeker ||
        findEmailCorporate
      ) {
        throw new ConflictException(
          `This email ${createUserDto.email} has already been used. Please use a different email.`,
        );
      }

      // contact no
      // const findContactNoAdmin = await this.adminRepo.findOne({
      //   where: { contactNo: createUserDto.contactNo },
      // });

      // const findContactNoRecruiter = await this.recruiterRepo.findOne({
      //   where: { contactNo: createUserDto.contactNo },
      // });

      // const findContactNoJobSeeker = await this.jobSeekerRepo.findOne({
      //   where: { contactNo: createUserDto.contactNo },
      // });

      // const findContactNoCorporate = await this.corporateRepo.findOne({
      //   where: { contactNo: createUserDto.contactNo },
      // });

      // if (
      //   findContactNoAdmin ||
      //   findContactNoRecruiter ||
      //   findContactNoJobSeeker ||
      //   findContactNoCorporate
      // ) {
      //   throw new ConflictException(
      //     `This contact number ${createUserDto.contactNo} has already been used. Please use a different contact number.`,
      //   );
      // }
    } catch (error) {
      const { response } = error;
      if (response?.statusCode === 409) {
        throw new ConflictException(response.message);
      }
      throw error;
    }
  }

  async create(createUserDto: any) {
    try {
      console.log('Hit 2');
      await this.checkForCommonUserDuplicates(createUserDto);
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
      // handle the case where there is duplicate username / email / contact no
      const { response } = err;
      if (response?.statusCode === 409) {
        throw new ConflictException(response.message);
      }
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

  formatDateByMonth(isoString) {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const date = new Date(isoString);
    const month = months[date.getMonth()].toUpperCase();
    const year = date.getFullYear().toString().slice(-2);
    return `${month}-${year}`;
  }

  formatDateByDay(isoString) {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const date = new Date(isoString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()].toUpperCase();
    const year = date.getFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;
  }

  formatDateByWeek(isoString, reference) {
    const targetDate = new Date(isoString);

    for (let range of reference) {
      const [start, end] = range.split(' to ');
      const startDate = this.parseDate(start);
      const endDate = this.parseDate(end);

      if (targetDate >= startDate && targetDate <= endDate) {
        return range;
      }
    }

    return 'Date out of range';
  }

  parseDate(dateString) {
    const [day, month, year] = dateString.split('-');
    const months = {
      JAN: 0,
      FEB: 1,
      MAR: 2,
      APR: 3,
      MAY: 4,
      JUN: 5,
      JUL: 6,
      AUG: 7,
      SEP: 8,
      OCT: 9,
      NOV: 10,
      DEC: 11,
    };
    return new Date(
      global.Number(`20${year}`),
      months[month],
      global.Number(day),
    );
  }

  obtainDateByDayWeeksMonth() {
    const startDate = new Date('2023-08-27');
    const today = new Date();

    // Array for days
    const dateArrayInDays = [];
    let currentDate = new Date(startDate);
    while (currentDate <= today) {
      const day = currentDate.getDate().toString().padStart(2, '0');
      const month = currentDate
        .toLocaleString('en-us', { month: 'short' })
        .toUpperCase();
      const year = currentDate.getFullYear().toString().slice(-2);
      dateArrayInDays.push(`${day}-${month}-${year}`);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Array for weeks
    const dateArrayByWeek = [];
    currentDate = new Date(startDate);
    while (currentDate <= today) {
      const startDay = currentDate.getDate().toString().padStart(2, '0');
      const startMonth = currentDate
        .toLocaleString('en-us', { month: 'short' })
        .toUpperCase();
      const startYear = currentDate.getFullYear().toString().slice(-2);

      // Calculate the end date of the week
      let endDate = new Date(currentDate);
      endDate.setDate(endDate.getDate() + 6);
      if (endDate > today) {
        endDate = today;
      }

      const endDay = endDate.getDate().toString().padStart(2, '0');
      const endMonth = endDate
        .toLocaleString('en-us', { month: 'short' })
        .toUpperCase();
      const endYear = endDate.getFullYear().toString().slice(-2);

      // Add the week to the array
      dateArrayByWeek.push(
        `${startDay}-${startMonth}-${startYear} to ${endDay}-${endMonth}-${endYear}`,
      );

      // Increment the date
      currentDate.setDate(currentDate.getDate() + 7);
    }

    // Array for months
    const dateArrayInMonths = [];
    currentDate = new Date(startDate);
    while (currentDate <= today) {
      const month = currentDate
        .toLocaleString('en-us', { month: 'short' })
        .toUpperCase();
      const year = currentDate.getFullYear().toString().slice(-2);
      const monthYear = `${month}-${year}`;
      if (!dateArrayInMonths.includes(monthYear)) {
        dateArrayInMonths.push(monthYear);
      }
      currentDate.setDate(1); // Set to the 1st to prevent rollover
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return {
      dateArrayInDays,
      dateArrayByWeek,
      dateArrayInMonths,
    };
  }

  // 0(N) time complexity yooo
  async findAllStatistics() {
    const userData = (await this.findAll()).data;

    let overviewStatistics = {
      jobSeeker: 0,
      corporate: 0,
      recruiter: 0,
      administrator: 0,
    };

    const statistics = {
      Corporate: {},
      Job_Seeker: {},
      Recruiter: {},
      Administrator: {},
    };

    const result = this.obtainDateByDayWeeksMonth();
    const month = result.dateArrayInMonths;
    const day = result.dateArrayInDays;
    const weeks = result.dateArrayByWeek;

    // Single pass to calculate all statistics
    for (const data of userData) {
      const monthSum = this.formatDateByMonth(data.createdAt);
      const daySum = this.formatDateByDay(data.createdAt);
      const weekSum = this.formatDateByWeek(data.createdAt, weeks);

      const role = data.role;
      if (data.role === UserRoleEnum.JOBSEEKER) {
        overviewStatistics.jobSeeker = overviewStatistics.jobSeeker + 1;
      } else if (data.role === UserRoleEnum.CORPORATE) {
        overviewStatistics.corporate = overviewStatistics.corporate + 1;
      } else if (data.role === UserRoleEnum.ADMINISTRATOR) {
        overviewStatistics.administrator = overviewStatistics.administrator + 1;
      } else if (data.role === UserRoleEnum.RECRUITER) {
        overviewStatistics.recruiter = overviewStatistics.recruiter + 1;
      }
      statistics[role][monthSum] = (statistics[role][monthSum] || 0) + 1;
      statistics[role][daySum] = (statistics[role][daySum] || 0) + 1;
      statistics[role][weekSum] = (statistics[role][weekSum] || 0) + 1;
    }

    const userStatistics = {
      overall: overviewStatistics,
      month: {
        labels: month,
        dataCorporate: month.map(
          (label: string) => statistics.Corporate[label] || 0,
        ),
        dataJobSeeker: month.map(
          (label: string) => statistics.Job_Seeker[label] || 0,
        ),
        dataRecruiter: month.map(
          (label: string) => statistics.Recruiter[label] || 0,
        ),
        dataAdmin: month.map(
          (label: string) => statistics.Administrator[label] || 0,
        ),
      },
      day: {
        labels: day,
        dataCorporate: day.map(
          (label: string) => statistics.Corporate[label] || 0,
        ),
        dataJobSeeker: day.map(
          (label: string) => statistics.Job_Seeker[label] || 0,
        ),
        dataRecruiter: day.map(
          (label: string) => statistics.Recruiter[label] || 0,
        ),
        dataAdmin: day.map(
          (label: string) => statistics.Administrator[label] || 0,
        ),
      },
      week: {
        labels: weeks,
        dataCorporate: weeks.map(
          (label: string) => statistics.Corporate[label] || 0,
        ),
        dataJobSeeker: weeks.map(
          (label: string) => statistics.Job_Seeker[label] || 0,
        ),
        dataRecruiter: weeks.map(
          (label: string) => statistics.Recruiter[label] || 0,
        ),
        dataAdmin: weeks.map(
          (label: string) => statistics.Administrator[label] || 0,
        ),
      },
    };

    return {
      statusCode: HttpStatus.OK,
      message: 'User statistics retrieved',
      data: userStatistics,
    };
  }

  async findBreakdownStatistics() {
    const userData = (await this.findAll()).data;

    let activeStatistics = {
      jobSeeker: 0,
      corporate: 0,
      recruiter: 0,
      administrator: 0,
      total: 0,
    };

    let inactiveStatistics = {
      jobSeeker: 0,
      corporate: 0,
      recruiter: 0,
      administrator: 0,
      total: 0,
    };

    for (const data of userData) {
      if (data.status === UserStatusEnum.ACTIVE) {
        const role = data.role;
        if (data.role === UserRoleEnum.JOBSEEKER) {
          activeStatistics.jobSeeker = activeStatistics.jobSeeker + 1;
        } else if (data.role === UserRoleEnum.CORPORATE) {
          activeStatistics.corporate = activeStatistics.corporate + 1;
        } else if (data.role === UserRoleEnum.ADMINISTRATOR) {
          activeStatistics.administrator = activeStatistics.administrator + 1;
        } else if (data.role === UserRoleEnum.RECRUITER) {
          activeStatistics.recruiter = activeStatistics.recruiter + 1;
        }
        activeStatistics.total = activeStatistics.total + 1;
      } else if (data.status === UserStatusEnum.INACTIVE) {
        const role = data.role;
        if (data.role === UserRoleEnum.JOBSEEKER) {
          inactiveStatistics.jobSeeker = inactiveStatistics.jobSeeker + 1;
        } else if (data.role === UserRoleEnum.CORPORATE) {
          inactiveStatistics.corporate = inactiveStatistics.corporate + 1;
        } else if (data.role === UserRoleEnum.ADMINISTRATOR) {
          inactiveStatistics.administrator =
            inactiveStatistics.administrator + 1;
        } else if (data.role === UserRoleEnum.RECRUITER) {
          inactiveStatistics.recruiter = inactiveStatistics.recruiter + 1;
        }
        inactiveStatistics.total = inactiveStatistics.total + 1;
      }
    }

    const userStatistics = {
      active: activeStatistics,
      inactive: inactiveStatistics,
    };

    return {
      statusCode: HttpStatus.OK,
      message: 'User breakdown statistics retrieved',
      data: userStatistics,
    };
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

  // find all jobSeekers and Corporates that does not have an existing chat with recruiter
  async findAllCreateChats(userId: number) {
    try {
      const [jobSeekersResponse, corporatesResponse] = await Promise.all([
        this.jobSeekerService.findAll(),
        this.corporateService.findAll(),
      ]);
      const allUsers = [...jobSeekersResponse.data, ...corporatesResponse.data];
      const output = allUsers.filter(
        (user) =>
          user.status == 'Active' && !hasChattedWithUser(user.chats, userId),
      );
      return output;
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

const hasChattedWithUser = (chats, userId) => {
  // console.log(chats);
  if (chats.length > 0) {
    for (let i = 0; i < chats.length; i++) {
      if (chats[i].recruiter.userId === userId) {
        return true;
      }
    }
  }
  return false;
};
