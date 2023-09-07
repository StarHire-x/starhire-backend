import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryFailedError } from 'typeorm';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    try {
      console.log(createUserDto);
      return this.usersService.create(createUserDto);
        // You can also return an HTTP 404 Not Found response if the job seeker is not found
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Get('/all')
  findAllUsers() {
    return this.usersService.findAll();
  }

  // GET /users?id=1&?
  /*
  @Get()
  getUser(@Query('email') email: string, @Query('role') role: string) {
    try {
      console.log("You reached this endpoint");
      console.log(email)
      console.log(role);
      return this.usersService.findOneEmail(email, role);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }
  */

  @Get()
  getUser(@Query('email') email: string) {
    try {
      return this.usersService.findOneEmail(email);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  // GET /users/:id
  // @Get(':id')
  // findOneUser(@Param('id', ParseIntPipe) id: number) {
  //   try {
  //     return this.usersService.findOne(id);
  //   } catch (error) {
  //     if (error instanceof NotFoundException) {
  //       throw new HttpException(error.message, HttpStatus.NOT_FOUND);
  //     } else {
  //       throw new InternalServerErrorException('Internal server error');
  //     }
  //   }
  // }

  @Put(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateEmployerDto: UpdateUserDto,
  ) {
    try {
      return this.usersService.update(+id, updateEmployerDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Delete(':id')
  removeUser(
    @Param('id', ParseIntPipe) id: number,
    @Query('role') role: string,
  ) {
    try {
      return this.usersService.remove(+id, role);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          `User with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }
}
