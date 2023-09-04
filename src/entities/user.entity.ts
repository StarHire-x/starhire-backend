import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsEnum } from "class-validator";
import UserStatusEnum from "src/enums/userStatus.enum";
import NotificationModeEnum from "src/enums/notificationMode.enum";

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

    @IsEnum(UserStatusEnum)
    status: UserStatusEnum;

    @IsEnum(NotificationModeEnum)
    notificationMode: NotificationModeEnum;
    
    @Column()
    createdAt: Date;

    constructor(entity: Partial<User>) {
        Object.assign(this, entity);
    }
    
    // @PrimaryGeneratedColumn()
    // id: number;

    // @Column({ unique: true })
    // name: string;

    // @Column({ unique: true })
    // email: string;

    // @Column()
    // password: string;

    // @Column({ nullable: true })
    // createdAt: Date;

    // @Column({ nullable: true })
    // authStrategy: string;
}
