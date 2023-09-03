import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { entityList } from './entityList';
import { AdministratorModule } from './administrator/admin.module';
import { EventListingModule } from './event-listing/event-listing.module';
import { EventRegistrationModule } from './event-registration/event-registration.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'database-1.cvyrjcgz0edy.ap-southeast-2.rds.amazonaws.com',
      port: 3306,
      username: 'admin',
      password: 'password',
      database: 'starhire_backend_pair1',
      entities: entityList,
      synchronize: true,
    }),
    UsersModule,
    AdministratorModule,
    EventListingModule,
    EventRegistrationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
