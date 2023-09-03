import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {Administrator} from "../entities/administrator.entity";
import { Repository } from "typeorm";
import { AdministratorDetailDto } from "./dto/admin-detail.dto";
import { UpdateAdministratorDto } from "./dto/update-admin.dto";


@Injectable()
export class AdministratorRepo {

    constructor(
        @InjectRepository(Administrator) private administratorRepository: Repository<Administrator>,
    ) {
    }

    async findAllAdministrators(): Promise<Administrator[]> {
        return this.administratorRepository.find();
    }

    async findOneAdministrator(userId: number): Promise<Administrator> {
        return await this.administratorRepository.findOneBy( { userId: userId });
    }

    async createAdministrator(administratorDetails: AdministratorDetailDto): Promise<Administrator> {
        const newAdministrator = this.administratorRepository.create({
            ...administratorDetails,
            createdAt: new Date(),
        });
        return this.administratorRepository.save(newAdministrator);
    }

    async deleteUser(userId: number): Promise<void> {
        const administrator = await this.administratorRepository.findOneBy( { userId: userId } );
        await this.administratorRepository.remove(administrator);
    }

    async updateAdministrator(userId: number, userDetails: UpdateAdministratorDto): Promise<Administrator> {
        const updateResult = await this.administratorRepository.update({ userId }, { ...userDetails });
        const updatedAdministrator: Administrator = await this.administratorRepository.findOneBy( { userId: userId });
        return updatedAdministrator;
    }
}