import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { LanguageEnum } from "./enums/language.enum";
import { Member } from "./member.entity";

@Entity()
export class MemberTranslation extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    language: LanguageEnum;

    @Column()
    isDefault: boolean;

    @Column()
    description: string;

    @ManyToOne(() => Member, member => member.translation)
    member: Member;

}