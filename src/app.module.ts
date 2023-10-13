import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { entityList } from './entityList';
import { JobApplicationModule } from './job-application/job-application.module';
import { DocumentModule } from './document/document.module';
import { ChatModule } from './chat/chat.module';
import { ChatMessageModule } from './chat-message/chat-message.module';
import { ForumPostsModule } from './forum-posts/forum-posts.module';
import { ForumCommentsModule } from './forum-comments/forum-comments.module';
import { CommissionModule } from './commission/commission.module';
import { InvoiceModule } from './invoice/invoice.module';
import { JobListingModule } from './job-listing/job-listing.module';
import { AdministratorModule } from './administrator/admin.module';
import { JobPreferenceModule } from './job-preference/job-preference.module';
import { JobSeekerModule } from './job-seeker/job-seeker.module';
import { EventListingModule } from './event-listing/event-listing.module';
import { EventRegistrationModule } from './event-registration/event-registration.module';
import { RecruiterModule } from './recruiter/recruiter.module';
import { CorporateModule } from './corporate/corporate.module';
import { TicketModule } from './ticket/ticket.module';
import { ReviewModule } from './review/review.module';
import { UploadModule } from './upload/upload.module';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './email/email.module';
import { JobExperienceModule } from './job-experience/job-experience.module';
import { JobAssignmentModule } from './job-assignment/job-assignment.module';
import { SavedJobListingModule } from './saved-job-listing/saved-job-listing.module';
import { DataInitModule } from './data-init/data-init.module';
import { ForumCategoriesModule } from './forum-categories/forum-categories.module';
import { TwilioController } from './twilio/twilio.controller';
import { TwilioService } from './twilio/twilio.service';
import { TwilioModule } from './twilio/twilio.module';
import { TypeformModule } from './typeform/typeform.module';

require('dotenv').config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST_URL,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: entityList,
      synchronize: true,
    }),
    UsersModule,
    JobApplicationModule,
    DocumentModule,
    ChatModule,
    ChatMessageModule,
    ForumPostsModule,
    ForumCommentsModule,
    CommissionModule,
    InvoiceModule,
    JobListingModule,
    AdministratorModule,
    JobPreferenceModule,
    JobExperienceModule,
    JobSeekerModule,
    EventListingModule,
    EventRegistrationModule,
    RecruiterModule,
    CorporateModule,
    TicketModule,
    ReviewModule,
    UploadModule,
    ConfigModule.forRoot({ isGlobal: true }),
    EmailModule,
    JobExperienceModule,
    JobAssignmentModule,
    SavedJobListingModule,
    DataInitModule,
    ForumCategoriesModule,
    TwilioModule,
    TypeformModule
  ],
  controllers: [AppController, TwilioController],
  providers: [AppService, TwilioService],
})
export class AppModule {}
