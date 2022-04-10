import { truncateSync } from "fs";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Challenge } from "./challenge.entity";
import { User } from "./user.entity";

@Entity()
export class ChallengePoint extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.challenge_points, {onDelete: "CASCADE", cascade: true})
    user: User;

    @ManyToOne(() => Challenge, challenge => challenge.challenge_points, 
    {onDelete: "CASCADE", cascade: true, nullable: true})
    challenge: Challenge;

    @Column()
    value: number;

    @Column({nullable: true})
    context: string;
}