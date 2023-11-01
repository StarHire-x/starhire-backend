import { Module } from '@nestjs/common';
import { CommissionRateService } from './commission-rate.service';
import { CommissionRateController } from './commission-rate.controller';
import { CommissionRate } from '../entities/commissionRate.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CommissionRate])],
  controllers: [CommissionRateController],
  providers: [CommissionRateService],
})
export class CommissionRateModule {}
