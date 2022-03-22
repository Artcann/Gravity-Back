import { BaseEntity, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Group } from "./group.entity";

@Entity()
export class Notification extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => Group)
    @JoinTable()
    groups: Group[];

}