import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsEnum } from 'class-validator';
import UserStatusEnum from '../enums/userStatus.enum';
import NotificationModeEnum from '../enums/notificationMode.enum';
import UserRoleEnum from '../enums/userRole.enum';

export abstract class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ unique: true })
  userName: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  contactNo: string;

  @Column({
    type: 'enum',
    enum: UserStatusEnum,
    default: UserStatusEnum.ACTIVE,
  })
  status: UserStatusEnum;

  @Column()
  @IsEnum(NotificationModeEnum)
  notificationMode: NotificationModeEnum;

  @Column()
  @IsEnum(UserRoleEnum)
  role: UserRoleEnum;

  @CreateDateColumn()
  createdAt: Date;

  constructor(entity: Partial<User>) {
    Object.assign(this, entity);
  }
}
