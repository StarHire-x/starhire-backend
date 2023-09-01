import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepo } from './users.repo';
import { QueryFailedError } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepo) {}

  async create(createUser: CreateUserDto) {
    try {
      const { ...userDetail } = createUser;
      return await this.usersRepo.createUser(userDetail);
    } catch(err) {
      throw new ConflictException("Inserting a duplicate entry into the database. Please check your data.");
    }
  }

  async findAll() {
    return await this.usersRepo.findAllUsers();
  }

  async findOne(id: number) {
    const user = await this.usersRepo.findOneUser(id);
    if(user === null) {
      throw new NotFoundException(`User with ID ${id} not found`);
    } else {
      return user;
    }
  }

  async update(id: number, updateUser: UpdateUserDto) {
    const user = await this.usersRepo.findOneUser(id);
    if (user === null) {
      throw new NotFoundException(`User with ID ${id} not found, Update Unsuccessful`);
    } else {
      return await this.usersRepo.updateUser(id, updateUser);
    }
  }

  async remove(id: number) {
    const user = await this.usersRepo.findOneUser(id);
    if (user === null) {
      throw new NotFoundException(`User with ID ${id} not found, Delete Unsuccessful`);
    } else {
      return await this.usersRepo.deleteUser(id);
    }
  }
}
