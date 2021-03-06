import { BaseEntity, BeforeInsert, Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable, ManyToOne, OneToOne } from "typeorm";
import * as bcrypt from "bcryptjs";
import { LanguageEnum } from "./enums/language.enum";
import { Role } from "./role.entity";
import { SocialNetwork } from "./social-network.entity";
import { Notification } from "./notification.entity";
import { Exclude } from "class-transformer";
import { Group } from "./group.entity";
import { ChallengeSubmission } from "./challenge-submission.entity";
import { ChallengeStatus } from "./challenge-status.entity";
import { Challenge } from "./challenge.entity";
import { Member } from "./member.entity";
import { Chat } from "./chat.entity";
import { NotificationStatus } from "./notification-status.entity";
import { ChallengePoint } from "./challenge-point.entity";

@Entity()
export class User extends BaseEntity {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  username: string;

  @Column({nullable: true})
  first_name: string;

  @Column({nullable: true})
  last_name: string;

  @Exclude()
  @Column({nullable: false})
  password: string;

  @Column({unique: true})
  email: string;

  @Exclude()
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
  
  @Exclude()
  @Column({nullable: true})
  deviceToken: string;

  @Exclude()
  @Column({default: true})
  activityNotification: boolean;

  @Exclude()
  @Column({default: true})
  foodNotification: boolean;
  
  @Exclude()
  @Column({default: true})
  sponsorNotification: boolean;
  
  @Exclude()
  @Column({default: true})
  challengesNotification: boolean;

  @Exclude()
  @Column({default: true})
  firstConnection: boolean;

  @OneToOne(() => Member, {nullable: true})
  member: Member;

  @Column({nullable: true})
  url: string;

  @Column({nullable: true})
  socketId: string;

  @Exclude()
  @ManyToMany(() => Role, {cascade: true, eager: true})
  @JoinTable()
  role: Role[];

  @Exclude()
  @OneToMany(() => NotificationStatus, notification => notification.user, {eager: true})
  notification_status: NotificationStatus[]

  @OneToMany(() => SocialNetwork, social => social.user, {cascade: true, eager: true})
  @JoinTable()
  socials: SocialNetwork[]
  
  @ManyToMany(() => Group, group => group.user)
  groups: Group[];

  @Exclude()
  @OneToMany(() => ChallengeSubmission, challengeSubmission => challengeSubmission.user, {cascade: true, eager: true})
  challenge_submission: ChallengeSubmission[];

  @Exclude()
  @OneToMany(() => ChallengeStatus, challengeStatus => challengeStatus.user)
  challenge_status: ChallengeStatus[];

  @Exclude()
  @OneToMany(() => ChallengePoint, challenge_point => challenge_point.user)
  challenge_points: ChallengePoint[];

  @Exclude()
  @OneToMany(() => Chat, chat => chat.user)
  chat: Chat[];

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