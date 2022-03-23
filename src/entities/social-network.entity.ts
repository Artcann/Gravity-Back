import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { SocialNetworkEnum } from "./enums/social-network.enum";
import { User } from "./user.entity";

@Entity()
export class SocialNetwork extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: SocialNetworkEnum;

    @Column()
    url: string;

    @Column({default: false})
    public: boolean;

    @ManyToMany(() => User)
    @JoinTable()
    user: User[];
}