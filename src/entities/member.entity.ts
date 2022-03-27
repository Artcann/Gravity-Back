import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MemberTranslation } from "./member-translation.entity";

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

    @Column({nullable: true})
    image: string;

    @OneToMany(() => MemberTranslation, memberTranslation => memberTranslation.member, {cascade: true, eager: true})
    translation: MemberTranslation[];

}