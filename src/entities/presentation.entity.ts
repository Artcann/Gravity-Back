import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { LanguageEnum } from "./enums/language.enum";
import { PresentationEnum } from "./enums/presentation.enum";

@Entity()
export class Presentation extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: PresentationEnum;

    @Column()
    language: LanguageEnum;

    @Column()
    content: string;
}