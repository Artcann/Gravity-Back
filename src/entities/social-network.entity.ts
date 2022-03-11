import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { SocialNetworkEnum } from "./enums/social-network.enum";

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
}