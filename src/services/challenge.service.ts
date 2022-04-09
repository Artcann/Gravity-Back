import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateChallengeDto } from "src/dto/challenge/create-challenge.dto";
import { CreateSubmissionDto } from "src/dto/challenge/create-submission.dto";
import { ChallengeStatus } from "src/entities/challenge-status.entity";
import { ChallengeSubmission } from "src/entities/challenge-submission.entity";
import { Challenge } from "src/entities/challenge.entity";
import { ChallengeStatusEnum } from "src/entities/enums/challenge-status.enum";
import { ChallengeTypeEnum } from "src/entities/enums/challenge-type.enum";
import { LanguageEnum } from "src/entities/enums/language.enum";
import { User } from "src/entities/user.entity";

@Injectable()
export class ChallengeService {

    create(createChallengeDto: CreateChallengeDto) {
        const challenge = Challenge.create(createChallengeDto);
        return challenge.save();
    }

    async getNewChallengesByType(id: string, type: ChallengeTypeEnum, lang: LanguageEnum) {
        const user = await User.findOne(id);
        let challengesYouParticipatedIn = [];
        user.challenge_submission.forEach(challenge => {
            challengesYouParticipatedIn.push(challenge.challenge.id);
        })

        let challenges: any;

        if (challengesYouParticipatedIn.length !== 0) {
            challenges = Challenge.createQueryBuilder('challenge')
                .leftJoinAndSelect("challenge.translation", "translation", "translation.language = :language", {language: lang})
                .where("challenge.id NOT IN (:...challenges) AND challenge.type = :challengeType AND NOT (challenge.type = :type AND challenge.expiredAt < :date)", 
                {challenges: challengesYouParticipatedIn, challengeType: type, type: ChallengeTypeEnum.SPECIAL, date: new Date()})
                .getMany();
        } else {
            challenges = Challenge.createQueryBuilder('challenge')
                .leftJoinAndSelect("challenge.translation", "translation", "translation.language = :language", {language: lang})
                .where("challenge.type = :challengeType AND NOT (challenge.type = :type AND challenge.expiredAt < :date)",
                { challengeType: type, type: ChallengeTypeEnum.SPECIAL, date: new Date() })
                .getMany();
        }

        return challenges;
    }

    async getChallengesByStatus(userId: string, status: ChallengeStatusEnum, lang: LanguageEnum) {
        const challengeIdList = await ChallengeStatus.createQueryBuilder("challengeStatus")
        .innerJoinAndSelect('challengeStatus.user', 'user')
        .innerJoinAndSelect('challengeStatus.challenge', 'challenge')
        .leftJoinAndSelect("challenge.translation", "translation", "translation.language = :language", {language: lang})
        .where("challengeStatus.user = :id AND challengeStatus.status = :status AND NOT (challenge.type = :type AND challenge.expiredAt < :date)",
        {id: userId, status: status, type: ChallengeTypeEnum.SPECIAL, date: new Date() })
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

    async getChallengeById(challengeId: string, userId: string, lang: LanguageEnum) {
        const challenge = await Challenge.createQueryBuilder("challenge")
            .leftJoinAndSelect('challenge.challenge_submission', 'challenge_submission')
            .leftJoin('challenge_submission.user', 'user')
            .leftJoinAndSelect("challenge.translation", "translation", "translation.language = :language", {language: lang})
            .where('challenge.id = :challengeId AND user.id = :userId', {challengeId: challengeId, userId: userId})
            .getMany();

        return challenge;
    }

    async getAll() {
        const challenges = await Challenge.createQueryBuilder("challenge")
            .leftJoinAndSelect('challenge.challenge_submission', 'challenge_submission')
            .leftJoinAndSelect('challenge.translation', 'translation')
            .where("NOT (challenge.type = :type AND challenge.expiredAt < :date)", { type: ChallengeTypeEnum.SPECIAL, date: new Date() })
            .getMany();
        return challenges;
    }

    async updateSubmission(userId: string, challengeId: string, filepath: string, status: boolean) {
        const user = await User.findOne(userId);
        const challenge = await Challenge.findOne(challengeId);


        const submission = ChallengeSubmission.create({
            user: user,
            challenge: challenge,
            content: filepath,
            isFile: true,
            acceptToShareImage: status
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

    async submitChallengeAnswer(createSubmissionDto: CreateSubmissionDto, userId: string) {
        const user = await User.findOne(+userId);
        const challenge = await Challenge.findOne(createSubmissionDto.challengeId);

        let status = await ChallengeStatus.createQueryBuilder("status")
            .leftJoin("status.user", "user")
            .leftJoin("status.challenge", "challenge")
            .where("user.id = :userId AND challenge.id = :challengeId", {userId: userId, challengeId: createSubmissionDto.challengeId})
            .getOne();
        
        console.log(status);
        
        if (!status) {
            const newStatus = ChallengeStatus.create({
                user: user,
                challenge: challenge,
                status: ChallengeStatusEnum.PROCESSING,
            });
    
            newStatus.save();
            console.log(newStatus);
        } else if (status.status !== ChallengeStatusEnum.PROCESSING) {
            status.status = ChallengeStatusEnum.PROCESSING;
            status.save();
        }

        

        

        const payload = {user: user, challenge: challenge, ...createSubmissionDto};

        const submission = await ChallengeSubmission.create(payload);

        submission.save();

        return submission;
    }

    async challengeOwnedByUser(userId: string, challengeId: string) {
        
        const submission = await ChallengeSubmission.createQueryBuilder("challengeSubmission")
            .leftJoinAndSelect('challengeSubmission.user', 'user')
            .leftJoinAndSelect('challengeSubmission.challenge', 'challenge')
            .where("challengeSubmission.id = :id", {id: challengeId})
            .getOne();

        if(submission === undefined) {
            throw new NotFoundException({
                message: "Submission with id : " + challengeId +" does not existe in database"
            });
        }
        
        return submission.user.id === +userId;
    }

    async isChallengeClosed(challengeId: string) {
        const challenge = await Challenge.findOne(challengeId);
        return challenge.type === ChallengeTypeEnum.SPECIAL && challenge.expiredAt.getTime() < new Date().getTime();
    }

}