import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { CommissionRateService } from './commission-rate.service';
import { CreateCommissionRateDto } from './dto/create-commission-rate.dto';
import { UpdateCommissionRateDto } from './dto/update-commission-rate.dto';

@Controller('commission-rate')
export class CommissionRateController {
  constructor(private readonly commissionRateService: CommissionRateService) {}

  @Post()
  create(@Body() createCommissionRateDto: CreateCommissionRateDto) {
    return this.commissionRateService.create(createCommissionRateDto);
  }

  @Get()
  findAll() {
    return this.commissionRateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commissionRateService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCommissionRateDto: UpdateCommissionRateDto) {
    return this.commissionRateService.update(+id, updateCommissionRateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commissionRateService.remove(+id);
  }
}
