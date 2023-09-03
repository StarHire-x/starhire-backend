import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "eventRegistrations"})
export class EventRegistration {
    @PrimaryGeneratedColumn()
    eventRegistrationId: number;

    @Column()
    isActive: boolean;

    constructor(entity: Partial<EventRegistration>) {
        Object.assign(this, entity);
    }
}
