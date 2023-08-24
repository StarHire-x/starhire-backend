import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepo } from './users.repo';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepo) {}

  async create(createUser: CreateUserDto) {
    const { ...userDetail } = createUser;
    return await this.usersRepo.createUser(userDetail);
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
