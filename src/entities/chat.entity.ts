import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Chat extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @Column()
    isAdmin: boolean;

    @ManyToOne(() => User, user => user.chat)
    user: User;

    @Column({nullable: true})
    date: Date;
}