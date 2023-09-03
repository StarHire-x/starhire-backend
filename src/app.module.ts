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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
