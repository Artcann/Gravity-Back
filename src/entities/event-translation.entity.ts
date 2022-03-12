import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { LanguageEnum } from "./enums/language.enum";
import { Event } from "./event.entity";

@Entity()
export class EventTranslation extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    language: LanguageEnum;

    @Column()
    isDefault: boolean;

    @Column()
    short_desc: string;

    @Column()
    long_desc: string;

    @Column()
    title: string;

    @ManyToOne(() => Event, event => event.translation)
    event: Event

}