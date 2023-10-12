import { Module } from '@nestjs/common';
import { AdministratorService } from './admin.service';
import { AdministratorController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Administrator } from '../entities/administrator.entity';
import { EmailService } from 'src/email/email.service';
import { TwilioService } from 'src/twilio/twilio.service';

@Module({
  imports: [TypeOrmModule.forFeature([Administrator])],
  controllers: [AdministratorController],
  providers: [AdministratorService, EmailService, TwilioService],
})
export class AdministratorModule {}
