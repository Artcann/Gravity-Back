import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { LanguageEnum } from "./enums/language.enum";
import { QuaranteMilleEuros } from "./sponsor.entity";

@Entity()
export class SponsorTranslation extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    language: LanguageEnum;
    
    @Column()
    isDefault: boolean;

    @Column()
    description: string;

    @Column()
    context_text: string;

    @ManyToOne(() => QuaranteMilleEuros, quaranteMilleEuro => quaranteMilleEuro.translation, {onDelete: "CASCADE"})
    sponsor: QuaranteMilleEuros;
}