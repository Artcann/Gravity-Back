import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Group extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    groupLabel: string;

    @ManyToMany(() => Notification)
    @JoinTable()
    notifications: Notification[];
}