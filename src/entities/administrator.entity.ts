import { Column, Entity, PrimaryGeneratedColumn, EntityManager } from 'typeorm';
import { IsEnum } from 'class-validator';
import { User } from './user.entity';

@Entity({ name: 'administrators' })
export class Administrator extends User {
  constructor(entity: Partial<User>) {
    super(entity);
  }
}
