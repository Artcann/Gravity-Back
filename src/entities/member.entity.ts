import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Division } from "./division.entity";
import { MemberTranslation } from "./member-translation.entity";
import { User } from "./user.entity";

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
    role: string;

    @Column({nullable: true})
    image: string;

    @OneToMany(() => MemberTranslation, memberTranslation => memberTranslation.member, {cascade: true, eager: true})
    translation: MemberTranslation[];

    @Column({name: "user_id", nullable: true})
    userId: number;

    @OneToOne(() => User, {nullable: true})
    @JoinColumn({name: "user_id"})
    user: User;

    @ManyToMany(() => Division)
    division: Division[];

}