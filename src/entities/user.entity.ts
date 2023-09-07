import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsEnum } from 'class-validator';
import UserStatusEnum from 'src/enums/userStatus.enum';
import NotificationModeEnum from 'src/enums/notificationMode.enum';
import UserRoleEnum from 'src/enums/userRole.enum';

export abstract class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ unique: true })
  userName: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
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
