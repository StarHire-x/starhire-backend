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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'database-1.cvyrjcgz0edy.ap-southeast-2.rds.amazonaws.com',
      port: 3306,
      username: 'admin',
      password: 'password',
      database: 'starhire_backend_pair2',
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
