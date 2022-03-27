import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { LanguageEnum } from "./enums/language.enum";

@Entity()
export class ChallengeTranslation extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    language: LanguageEnum;

    @Column()
    title: string;

    @Column()
    subtitle: string;

    @Column()
    description: string;

    @Column()
    rejectReason: string;
}