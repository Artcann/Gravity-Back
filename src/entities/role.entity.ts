import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Role extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    roleLabel: string;

    @ManyToMany(() => User)
    @JoinColumn()
    user: User[];
}