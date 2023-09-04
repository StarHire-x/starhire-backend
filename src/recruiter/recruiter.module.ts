import { Module } from '@nestjs/common';
import { RecruiterService } from './recruiter.service';
import { RecruiterController } from './recruiter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recruiter } from '../entities/recruiter.entity';
import { RecruiterRepo } from './recruiter.repo';

@Module({
  imports: [TypeOrmModule.forFeature([Recruiter])],
  controllers: [RecruiterController],
  providers: [RecruiterService, RecruiterRepo],
})
export class RecruiterModule {}
