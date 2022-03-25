import { BaseEntity, BeforeInsert, Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable, ManyToOne } from "typeorm";
import * as bcrypt from "bcryptjs";
import { LanguageEnum } from "./enums/language.enum";
import { Role } from "./role.entity";
import { SocialNetwork } from "./social-network.entity";
import { Event } from "./event.entity"

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  username: string;

  @Column({nullable: true})
  first_name: string;

  @Column({nullable: true})
  last_name: string;

  @Column({nullable: false})
  password: string;

  @Column({unique: true})
  email: string;

  @Column({default: LanguageEnum.FR})
  language: string;

  @Column({nullable: true})
  description: string;

  @Column({nullable: true})
  profile_picture: string;

  @Column({nullable: true})
  phone_number: string;

  @Column({nullable: true})
  promo: string;

  @Column({ nullable: true })
  address: string;

  @ManyToMany(() => Role, {cascade: true, eager: true})
  @JoinTable()
  role: Role[];

  @ManyToMany(() => SocialNetwork, {cascade: true, eager: true})
  @JoinTable()
  socials: SocialNetwork[]

  @BeforeInsert()
  async hashPassword() {
    if(this.password) {
      this.password = await bcrypt.hash(this.password, 8);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}