import { Geometry } from "geojson";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SponsorTypeEnum } from "./enums/sponsor-type.enum";
import { SponsorTranslation } from "./sponsor-translation.entity";

@Entity()
export class QuaranteMilleEuros extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: SponsorTypeEnum;

    @Column()
    name: string;

    @Column()
    link: string;

    @Column()
    picture: string;

    @Column("geometry")
    location: Geometry;

    @OneToMany(() => SponsorTranslation, sponsorTranslation => sponsorTranslation.sponsor)
    translation: SponsorTranslation[];
}