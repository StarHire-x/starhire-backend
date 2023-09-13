import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { JobSeekerService } from 'src/job-seeker/job-seeker.service';
import { RecruiterService } from 'src/recruiter/recruiter.service';
import { CorporateService } from 'src/corporate/corporate.service';
import { AdministratorService } from 'src/administrator/admin.service';
import { JobSeeker } from 'src/entities/jobSeeker.entity';
import { Recruiter } from 'src/entities/recruiter.entity';
import { Corporate } from 'src/entities/corporate.entity';
import { Administrator } from 'src/entities/administrator.entity';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';


require("dotenv").config();

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      JobSeeker,
      Recruiter,
      Corporate,
      Administrator,
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '2 days' },
    }),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    JobSeekerService,
    RecruiterService,
    CorporateService,
    AdministratorService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    }
  ],
})
export class UsersModule {}

