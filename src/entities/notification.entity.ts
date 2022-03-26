import { BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Group } from "./group.entity";
import { User } from "./user.entity";

@Entity()
export class Notification extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => Group)
    @JoinTable()
    groups: Group[];

    @Column()
    content: string;

    @Column({default: true})
    isNew: boolean;

    @ManyToOne(() => User, user => user.notifications)
    user: User;

}