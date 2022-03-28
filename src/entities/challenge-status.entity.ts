import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Challenge } from "./challenge.entity";
import { ChallengeStatusEnum } from "./enums/challenge-status.enum";

@Entity()
export class ChallengeStatus extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @ManyToOne(() => User, user => user.challenge_status, {onDelete: "CASCADE"})
    user: User;

    @ManyToOne(() => Challenge, challenge => challenge.challenge_status, {onDelete: "CASCADE"})
    challenge: Challenge;

    @Column()
    status: ChallengeStatusEnum;

    @Column()
    context: string;
}