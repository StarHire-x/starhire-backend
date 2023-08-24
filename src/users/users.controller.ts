import { Controller, Get, Post, Body, Patch, Param, Delete, Put, NotFoundException, HttpException, InternalServerErrorException, HttpStatus, ParseIntPipe, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('/all')
  findAllUsers() {
    return this.usersService.findAll();
  }

  // GET /users?id=1 
  @Get()
  getNinjas(@Query('id') id: number) {
    try {
      return this.usersService.findOne(id);
    } catch(error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(`User with id ${id} not found`, HttpStatus.NOT_FOUND);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  // GET /users/:id
  @Get(':id')
  findOneUser(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.usersService.findOne(id);
    } catch(error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(`User with ID ${id} not found`, HttpStatus.NOT_FOUND);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Put(':id')
  updateUser(@Param('id', ParseIntPipe) id: string, @Body() updateEmployerDto: UpdateUserDto) {
    try {
      return this.usersService.update(+id, updateEmployerDto);
    } catch(error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(`User with id ${id} not found`, HttpStatus.NOT_FOUND);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Delete(':id')
  removeUser(@Param('id', ParseIntPipe) id: string) {
    try {
      return this.usersService.remove(+id);
    } catch(error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(`User with ID ${id} not found`, HttpStatus.NOT_FOUND);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }
}
