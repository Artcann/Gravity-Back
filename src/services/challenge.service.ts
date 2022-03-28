import { Injectable } from "@nestjs/common";
import { ChallengeStatus } from "src/entities/challenge-status.entity";
import { ChallengeSubmission } from "src/entities/challenge-submission.entity";
import { Challenge } from "src/entities/challenge.entity";
import { ChallengeStatusEnum } from "src/entities/enums/challenge-status.enum";
import { ChallengeTypeEnum } from "src/entities/enums/challenge-type.enum";
import { User } from "src/entities/user.entity";

@Injectable()
export class ChallengeService {

    async getNewChallengesByType(id: string, type: ChallengeTypeEnum) {
        const user = await User.findOne(id);
        let challengesYouParticipatedIn = [];
        user.challenge_submission.forEach(challenge => {
            challengesYouParticipatedIn.push(challenge.challenge.id);
        })

        const challenges = Challenge.createQueryBuilder('challenge')
            .where("challenge.id != ANY (:challenges) AND challenge.type = :challengeType", 
            {challenges: challengesYouParticipatedIn, challengeType: type})
            .getMany();

        return challenges;
    }

    async getChallengesByStatus(userId: string, status: ChallengeStatusEnum) {
        const challengeIdList = await ChallengeStatus.createQueryBuilder("challengeStatus")
        .innerJoinAndSelect('challengeStatus.user', 'user')
        .innerJoinAndSelect('challengeStatus.challenge', 'challenge')
        .where("challengeStatus.user = :id AND challengeStatus.status = :status", {id: userId, status: status})
        .getMany()

        let challengeList = [];

        for(let challenge of challengeIdList) {
            challengeList.push({
                ...challenge.challenge,
                context: challenge.context
            });
        }

        return challengeList;
    }

    async getChallengeById(challengeId: string) {
        const challenge = await Challenge.createQueryBuilder("challenge")
            .leftJoinAndSelect('challenge.challenge_submission', 'challenge_submission')
            .where('challenge.id = :id', {id: challengeId})
            .getMany();

        return challenge;
    }

    async updateSubmission(userId: string, challengeId: string, filepath: string) {
        const user = await User.findOne(userId);
        const challenge = await Challenge.findOne(challengeId);


        const submission = ChallengeSubmission.create({
            user: user,
            challenge: challenge,
            content: filepath,
            isFile: true
        })

        submission.save();

        return submission.content;
    }

    deleteSubmission(submissionId: string) {
        return ChallengeSubmission.delete(submissionId);
    }

    async changeShareStatus(id: string) {
        const submission = await ChallengeSubmission.findOne(id);
        submission.acceptToShareImage = !submission.acceptToShareImage;

        return submission;
    }

}