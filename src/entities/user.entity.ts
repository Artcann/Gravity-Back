import { BaseEntity, BeforeInsert, Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import * as bcrypt from "bcryptjs";
import { Role } from "./enums/role.enum";
import { Language } from "./enums/language.enum";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  username: string;

  @Column({nullable: false})
  password: string;

  @Column({unique: true})
  email: string;

  @Column({default: Role.User})
  role: string;

  @Column({default: Language.FR})
  language: string;

  @Column()
  description: string;

  @Column()
  profile_picture: string;

  @Column()
  phone_number: string;

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