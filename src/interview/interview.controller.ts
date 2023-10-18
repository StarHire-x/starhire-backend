import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { Interview } from 'src/entities/interview.entity';
import { Public } from 'src/users/public.decorator';

@Controller('interview')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @Post()
  async create(@Body() createInterviewDto: CreateInterviewDto) {
    const interview =
      await this.interviewService.createInterview(createInterviewDto);
    return interview;
  }

  @Public()
  @Get('/:userId/:role')
  async getInterviewDatesByUserID(
    @Param('userId') userId: string,
    @Param('role') role: string,
  ) {
    const result = await this.interviewService.getInterviewDatesByUserID(
      userId,
      role,
    );
    if (result.statusCode === HttpStatus.OK) {
      console.log(result);
      return result;
    } else {
      return { statusCode: result.statusCode, message: result.message };
    }
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
