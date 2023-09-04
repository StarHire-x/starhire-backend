import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdministratorDto } from './dto/create-admin.dto';
import { UpdateAdministratorDto } from './dto/update-admin.dto';
import { AdministratorRepo } from './admin.repo';
import { QueryFailedError } from 'typeorm';

@Injectable()
export class AdministratorService {
  constructor(private readonly administratorRepo: AdministratorRepo) {}

  async create(createAdministrator: CreateAdministratorDto) {
    try {
      const { ...administratorDetail } = createAdministrator;
      return await this.administratorRepo.createAdministrator(administratorDetail);
    } catch(err) {
      throw new ConflictException("Inserting a duplicate entry into the database. Please check your data.");
    }
  }

  async findAll() {
    return await this.administratorRepo.findAllAdministrators();
  }

  async findOne(id: number) {
    const administrator= await this.administratorRepo.findOneAdministrator(id);
    if(administrator === null) {
      throw new NotFoundException(`User with ID ${id} not found`);
    } else {
      return administrator;
    }
  }

  async update(id: number, updateUser: UpdateAdministratorDto) {
    const user = await this.administratorRepo.findOneAdministrator(id);
    if (user === null) {
      throw new NotFoundException(`User with ID ${id} not found, Update Unsuccessful`);
    } else {
      return await this.administratorRepo.updateAdministrator(id, updateUser);
    }
  }

  async remove(id: number) {
    const user = await this.administratorRepo.findOneAdministrator(id);
    if (user === null) {
      throw new NotFoundException(`User with ID ${id} not found, Delete Unsuccessful`);
    } else {
      return await this.administratorRepo.deleteUser(id);
    }
  }
}
