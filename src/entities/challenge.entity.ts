import { ChallengeTranslation } from './challenge-translation.entity';
import { BaseEntity, Column, Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ChallengeTypeEnum } from "./enums/challenge-type.enum";
import { ChallengeSubmissionTypeEnum } from "./enums/challenge-submission-type.enum";
import { ChallengeSubmission } from "./challenge-submission.entity";
import { ChallengeStatus } from "./challenge-status.entity";
import { ChallengePoint } from './challenge-point.entity';

@Entity()
export class Challenge extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    imageUri: string;

    @Column({ type: "timestamp"})
    expiredAt: Date;

    @Column()
    type: ChallengeTypeEnum;

    @Column()
    submissionType: ChallengeSubmissionTypeEnum;

    @OneToMany(() => ChallengeSubmission, challengeSubmission => challengeSubmission.challenge)
    challenge_submission: ChallengeSubmission[];

    @OneToMany(() => ChallengeStatus, challengeStatus => challengeStatus.challenge)
    challenge_status: ChallengeStatus[];

    @OneToMany(() => ChallengePoint, challenge_points => challenge_points.challenge)
    challenge_points: ChallengePoint[];

    @OneToMany(() => ChallengeTranslation, translation => translation.challenge, {cascade:true, eager: true})
    translation: ChallengeTranslation[];
}