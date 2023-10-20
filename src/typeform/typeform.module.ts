import { Module } from '@nestjs/common';
import { TypeformService } from './typeform.service';
import { TypeformController } from './typeform.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorporateTypeform } from 'src/entities/corporateTypeform.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([CorporateTypeform])],
  controllers: [TypeformController],
  providers: [TypeformService],
})
export class TypeformModule {}
