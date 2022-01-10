import { BaseEntity, BeforeInsert, Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Event extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  short_desc: string;

  @Column()
  long_desc: string;

  @Column()
  image: string;

  @Column()
  date: Date;

  @ManyToMany(() => User)
  @JoinTable()
  registered_user: User[];
}