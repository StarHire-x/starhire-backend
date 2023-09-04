import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateAdministratorDto } from './dto/create-admin.dto';
import { UpdateAdministratorDto } from './dto/update-admin.dto';
import { Repository } from 'typeorm';
import { Administrator } from 'src/entities/administrator.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from 'src/entities/ticket.entity';

@Injectable()
export class AdministratorService {
  constructor(
    @InjectRepository(Administrator)
    private readonly administratorRepository: Repository<Administrator>
    ) {}

  async create(createAdministratorDto: CreateAdministratorDto) {
    try {
      // This is to filter out the external relationship in the dto object.
      const { tickets, ...dtoExcludeRelationship } = 
      createAdministratorDto;

      // Creating administrator without the external relationship with other entities.
      const administrator = new Administrator({
        ...dtoExcludeRelationship
      });

      // Creating the classes for external relationship with other entities (OneToMany)
      if (createAdministratorDto.tickets.length > 0) {
        const createTickets = createAdministratorDto.tickets.map(
          (createTicketDto) => new Ticket(createTicketDto),
        );
        administrator.tickets = createTickets;
      }
      return await this.administratorRepository.save(administrator);
    } catch (error) {
      throw new HttpException(
        'Failed to create new administrator',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    return await this.administratorRepository.find();
  }

  async findOne(id: number) {
    try {
      // For this part, we want the relationship with other entities to show, at most 1 level, no need to be too detail
      return await this.administratorRepository.findOne({
        where:{userId: id },
        relations: {tickets: true}, 
      });
    } catch (error) {
      throw new HttpException(
        'Failed to find administrator',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: number, updateAdministratorDto: UpdateAdministratorDto) {
    try {
      const administrator = await this.administratorRepository.findOneBy({
        userId: id,
      });

      // This is to filter out the external relationships in the dto object
      const { tickets, ...dtoExcludeRelationship } = 
      updateAdministratorDto;

      Object.assign(administrator, dtoExcludeRelationship);

      // Same thing, u also update the entities with relationship as such
      if (tickets && tickets.length > 0) {
        const updatedAdministrator = updateAdministratorDto.tickets.map(
          (createTicketDto) => {
            return new Ticket(createTicketDto);
          },
        );
        return await this.administratorRepository.save(administrator);
      }
    } catch (error) {
      throw new HttpException(
        'Failed to update administrator',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: number) {
    try {
      return await this.administratorRepository.delete({
        userId: id,
      });
    } catch (error) {
      throw new HttpException(
        'Failed to delete administrator',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
