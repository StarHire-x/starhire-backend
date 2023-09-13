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
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryFailedError } from 'typeorm';
import { AuthGuard } from './auth.guard';
import { Public } from './public.decorator';
import { Roles } from './roles.decorator';
import UserRoleEnum from 'src/enums/userRole.enum';
import { RolesGuard } from './roles.guard';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public() // public because anyone can register for an account
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    try {
      return this.usersService.create(createUserDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Roles(UserRoleEnum.ADMINISTRATOR, UserRoleEnum.RECRUITER) // User mut be logged in + only admin and recruiter can get retrieve all users
  @UseGuards(RolesGuard)
  @Get('/all')
  async findAllUsers() {
    try {
      const result = await this.usersService.findAll();
      console.log(result);
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  // GET /users?id=1&?
  // @Get('/login')
  // async getUserByEmailandRole(
  //   @Query('email') email: string,
  //   @Query('role') role: string,
  // ) {
  //   try {
  //     const result = await this.usersService.findByEmail(email, role);
  //     console.log(result);
  //     return result;
  //   } catch (error) {
  //     if (error instanceof HttpException) {
  //       throw new HttpException(error.message, HttpStatus.NOT_FOUND);
  //     } else {
  //       throw new InternalServerErrorException('Internal server error');
  //     }
  //   }
  // }

  @Public() // public because everyone can log in
  @Get('/login')
  async signInWithEmailHashedPwRole(
    @Query('email') email: string,
    @Query('password') password: string,
    @Query('role') role: string,
  ) {
    try {
      const result = await this.usersService.signIn(email, password, role);
      console.log(result);
      return result;
    } catch (error) {
      if (error) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  // @Get()
  // getUser(@Query('email') email: string) {
  //   try {
  //     return this.usersService.findOneEmail(email);
  //   } catch (error) {
  //     if (error instanceof NotFoundException) {
  //       throw new HttpException(error.message, HttpStatus.NOT_FOUND);
  //     } else {
  //       throw new InternalServerErrorException('Internal server error');
  //     }
  //   }
  // }

  // retreive one user to check whether they exist in the system, please don't comment out it is for the forget password and account management so need to be public
  @Public()
  @Get('/find')
  async findOneUser(
    @Query('email') email: string,
    @Query('role') role: string,
  ) {
    try {
      const result = await this.usersService.findByEmail(email, role);
      console.log(result);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  // updateUser by default is already guarded by authentication, means users must be logged in to call this update user API route
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

  // For users to reset their password if they forget so need public access
  @Public()
  @Put('/reset/:id')
  resetUserPassword(
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

  // deleteUser by default is already guarded by authentication, means users must be logged in to call this delete user API route
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
