import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'database-1.cvyrjcgz0edy.ap-southeast-2.rds.amazonaws.com',
    port: 3306,
    username: 'admin',
    password: 'password',
    database: 'starhire_backend',
    entities: [User],
    synchronize: true,
  }), UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
