import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailController } from './email.controller';
import { JobListingService } from '../job-listing/job-listing.service';
import { JobListingController } from '../job-listing/job-listing.controller';
import { JobListingModule } from '../job-listing/job-listing.module';
import { Corporate } from '../entities/corporate.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobListing } from '../entities/jobListing.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobListing, Corporate]),
    ConfigModule.forRoot(),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: configService.get('EMAIL_USER'),
            pass: configService.get('EMAIL_PASS'),
          },
          tls: {
            rejectUnauthorized: false,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
