import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  NotFoundException,
  HttpException,
  InternalServerErrorException,
  HttpStatus,
  ParseIntPipe,
  Query,
  ConflictException,
} from '@nestjs/common';
import { CorporateService } from './corporate.service';
import { CreateCorporateDto } from './dto/create-corporate.dto';
import { UpdateCorporateDto } from './dto/update-corporate.dto';
import { Public } from 'src/users/public.decorator';

@Controller('corporate')
export class CorporateController {
  constructor(private readonly corporateService: CorporateService) {}

  @Post()
  createCorporate(@Body() createCorporateDto: CreateCorporateDto) {
    try {
      return this.corporateService.create(createCorporateDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Get('/all')
  findAllCorporates() {
    return this.corporateService.findAll();
  }

  @Public() //rmb to remove this, only for testing convinence
  @Get('/PromotionRequests')
  getRequestedCorporates() {
    return this.corporateService.getAllPromotionRequest();
  }

  @Public()
  @Get('/social')
  getAllCorporateSocial() {
    try {
      return this.corporateService.findAllCorporatesSocial();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Put('/following/:corporateId/:jobSeekerId')
  async followCorporate(
    @Param('corporateId') corporateId: string,
    @Param('jobSeekerId') jobSeekerId: string,
  ) {
    try {
      return this.corporateService.addFollower(corporateId, jobSeekerId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }
  
  @Put('/unfollow/:corporateId/:jobSeekerId')
  async unfollowCorporate(
    @Param('corporateId') corporateId: string,
    @Param('jobSeekerId') jobSeekerId: string,
  ) {
    try {
      return this.corporateService.removeFollower(corporateId, jobSeekerId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  // GET /corporate?id=1
  @Get()
  getNinjas(@Query('id') id: string) {
    try {
      return this.corporateService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  // GET /corporate/:id
  @Get(':id')
  findOneCorporate(@Param('id') id: string) {
    try {
      return this.corporateService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Put(':id')
  updateCorporate(
    @Param('id') id: string,
    @Body() updatedCorporate: UpdateCorporateDto,
  ) {
    try {
      return this.corporateService.update(id, updatedCorporate);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Delete(':id')
  removeCorporate(@Param('id') id: string) {
    try {
      return this.corporateService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          `Corporate User with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }
}



























// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { CorporateService } from './corporate.service';
// import { CreateCorporateDto } from './dto/create-corporate.dto';
// import { UpdateCorporateDto } from './dto/update-corporate.dto';

// @Controller('corporate')
// export class CorporateController {
//   constructor(private readonly corporateService: CorporateService) {}

//   @Post()
//   create(@Body() createCorporateDto: CreateCorporateDto) {
//     return this.corporateService.create(createCorporateDto);
//   }

//   @Get()
//   findAll() {
//     return this.corporateService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.corporateService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateCorporateDto: UpdateCorporateDto) {
//     return this.corporateService.update(+id, updateCorporateDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.corporateService.remove(+id);
//   }
// }
