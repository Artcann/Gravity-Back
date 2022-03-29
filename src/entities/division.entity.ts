import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { DivisionLabelEnum } from "./enums/division-label.enum";
import { Member } from "./member.entity";

@Entity()
export class Division extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    divisionLabel: DivisionLabelEnum;

    @ManyToMany(() => Member, {eager: true})
    @JoinTable()
    members: Member[];

    @Column()
    image: string;
}