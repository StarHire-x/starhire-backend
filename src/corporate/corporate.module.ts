import { Module } from '@nestjs/common';
import { CorporateService } from './corporate.service';
import { CorporateController } from './corporate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Corporate } from '../entities/corporate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Corporate])],
  controllers: [CorporateController],
  providers: [CorporateService],
})
export class CorporateModule {}


