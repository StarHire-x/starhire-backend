import { Module } from '@nestjs/common';
import { TypeformService } from './typeform.service';
import { TypeformController } from './typeform.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [TypeformController],
  providers: [TypeformService],
})
export class TypeformModule {}
