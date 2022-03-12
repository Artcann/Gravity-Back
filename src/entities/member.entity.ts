import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MemberTranslation } from "./member-translation.enum";

@Entity()
export class Member extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column()
    nickname: string;

    @Column()
    picture: string;

    @OneToMany(() => MemberTranslation, memberTranslation => memberTranslation.member)
    translation: MemberTranslation[];

}