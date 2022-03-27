import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Challenge } from "./challenge.entity";
import { User } from "./user.entity";

@Entity()
export class ChallengeSubmission extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.challenge_submission, {onDelete: "CASCADE"})
    user: User;

    @ManyToOne(() => Challenge, challenge => challenge.challenge_submission, {onDelete: "CASCADE", eager: true})
    challenge: Challenge;

    @Column()
    content: string;

    @Column()
    isFile: boolean;
}