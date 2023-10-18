import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { Interview } from './entities/interview.entity';

@Controller('interview')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @Post()
  async create(
    @Body() createInterviewDto: CreateInterviewDto,
  ): Promise<Interview> {
    const interview =
      await this.interviewService.createInterview(createInterviewDto);
    return interview;
  }

  /*
  @Get()
  findAll() {
    return this.interviewService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.interviewService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInterviewDto: UpdateInterviewDto,
  ) {
    return this.interviewService.update(+id, updateInterviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.interviewService.remove(+id);
  }
  */
}
