import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
import { UserDetailDto } from "./dto/user-detail.dto";
import { UpdateUserDto } from "./dto/update-user.dto";


@Injectable()
export class UsersRepo {

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
    ) {
    }

    async findAllUsers(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOneUser(userId: number): Promise<User> {
        return await this.userRepository.findOneBy( { id: userId });
    }

    async createUser(userDetails: UserDetailDto): Promise<User> {
        const newUser = this.userRepository.create({
            ...userDetails,
            createdAt: new Date(),
        });
        return this.userRepository.save(newUser);
    }

    async deleteUser(userId: number): Promise<void> {
        const user = await this.userRepository.findOneBy( { id: userId } );
        await this.userRepository.remove(user);
    }

    async updateUser(id: number, userDetails: UpdateUserDto): Promise<User> {
        const updateResult = await this.userRepository.update({ id }, { ...userDetails });
        const updatedUser: User = await this.userRepository.findOneBy( { id: id });
        return updatedUser;
    }
}