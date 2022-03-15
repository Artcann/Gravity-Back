import { BaseEntity, BeforeInsert, Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { EventTranslation } from "./event-translation.entity";
import { User } from "./user.entity";
import { Geometry, Point } from 'geojson';

@Entity()
export class Event extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  image: string;

  @Column()
  date: Date;

  @Column("geometry")
  location: Geometry;

  @Column()
  location_str: string;

  @Column()
  location_title: string;

  @Column()
  location_subtitle: string;

  @Column()
  open: boolean;

  @OneToMany(() => EventTranslation, eventTranslation => eventTranslation.event, {cascade: true, eager: true})
  translation: EventTranslation[];

  @ManyToMany(() => User)
  @JoinTable()
  registered_user: User[];
}