import { Challenge } from 'src/entities/challenge.entity';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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
    rewards: string;

    @ManyToOne(() => Challenge, challenge => challenge.translation)
    challenge: Challenge;

}