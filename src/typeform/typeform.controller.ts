import { Controller, Get } from '@nestjs/common';
import { TypeformService } from './typeform.service';

@Controller('typeform')
export class TypeformController {
  constructor(private readonly typeformService: TypeformService) {}

  @Get()
  findAll() {
    return this.typeformService.findAll();
  }
}
