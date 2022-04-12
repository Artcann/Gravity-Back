import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateChallengeDto } from "src/dto/challenge/create-challenge.dto";
import { CreatePointDto } from "src/dto/challenge/create-point.dto";
import { CreateSubmissionDto } from "src/dto/challenge/create-submission.dto";
import { ChallengePoint } from "src/entities/challenge-point.entity";
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

    async getChallengeSubmissionById(id: string) {
        return await ChallengeSubmission.findOne(id);
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

    async getChallengeSubmissionByUser(userId: string, challengeId: string) {
        const challenge = await ChallengeSubmission.createQueryBuilder("challengeSub")
            .leftJoin("challengeSub.user", "user")
            .leftJoin("challengeSub.challenge", "challenge")
            .where("user.id = :userId AND challenge.id = :challengeId", {userId: userId, challengeId: challengeId})
            .getMany();
        
        return challenge;
    }

    async getAll() {
        const challenges = await Challenge.createQueryBuilder("challenge")
            .leftJoinAndSelect('challenge.challenge_submission', 'challenge_submission')
            .leftJoinAndSelect('challenge_submission.user', 'user')
            .leftJoinAndSelect('challenge.translation', 'translation')
            .select(['challenge.id', 'challenge.imageUri', 'challenge.expiredAt', 'user.id', 'challenge_submission', 'challenge.submissionType', 'challenge.type'])
            .where("NOT (challenge.type = :type AND challenge.expiredAt < :date)", { type: ChallengeTypeEnum.SPECIAL, date: new Date() })
            .getMany();
        return challenges;
    }

    async getRanking() {
        const ranking = await User.createQueryBuilder('user')
        .leftJoinAndSelect('user.challenge_points', 'points')
        .select(["SUM (points.value) as user_points", "user.id", "user.first_name", "user.last_name", "user.profile_picture"])
        .groupBy('user.id')
        .having('SUM (points.value) > 0')
        .getRawMany();

        return ranking;
    }

    async getUserInProcessingByChallenge(challengeId: string) {
        const userProcessing = User.createQueryBuilder('user')
            .leftJoin('user.challenge_status', "status")
            .leftJoin('status.challenge', 'challenge')
            .select(["user.id"])
            .where('challenge.id = :challengeId AND status.status = :status',
                { challengeId: challengeId, status: ChallengeStatusEnum.PROCESSING })
            .getMany();
        
        return userProcessing;
    }

    async createPoint(createPointdto: CreatePointDto) {
        const user = await User.findOne(createPointdto.userId);
        let challenge: Challenge;
        if (createPointdto.challengeId) {
            challenge = await Challenge.findOne(createPointdto.challengeId);
        }

        console.log(createPointdto.userId);

        const point = ChallengePoint.create({
            user: user,
            challenge: challenge,
            value: createPointdto.value,
            context: createPointdto.context
        })

        return await point.save();
    }

    async updateSubmission(userId: string, challengeId: string, filepath: string, acceptToShare: string) {
        const user = await User.findOne(userId);
        const challenge = await Challenge.findOne(challengeId);

        let status = await ChallengeStatus.createQueryBuilder("status")
            .leftJoin("status.user", "user")
            .leftJoin("status.challenge", "challenge")
            .where("user.id = :userId AND challenge.id = :challengeId", {userId: userId, challengeId: challengeId})
            .getOne();
        
        
        if (!status) {
            const newStatus = ChallengeStatus.create({
                user: user,
                challenge: challenge,
                status: ChallengeStatusEnum.PROCESSING,
            });
    
            newStatus.save();
        } else if (status.status !== ChallengeStatusEnum.PROCESSING) {
            status.status = ChallengeStatusEnum.PROCESSING;
            status.save();
        }


        const submission = ChallengeSubmission.create({
            user: user,
            challenge: challenge,
            content: filepath,
            isFile: true,
            acceptToShareImage: JSON.parse(acceptToShare)
        })

        submission.save();

        return submission.content;
    }

    async deleteSubmissionStatus(userId: string, challengeId: string) {
        const challengeStatus = await ChallengeStatus.createQueryBuilder("challengeStatus")
            .leftJoin('challengeStatus.user', 'user')
            .leftJoin('challengeStatus.challenge', 'challenge')
            .where('user.id = :user AND challenge.id = :challenge', { user: userId, challenge: challengeId })
            .getOne();

        return ChallengeStatus.delete(challengeStatus.id);
    }

    async deleteSubmission(submissionId: string) {
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
        
        
        if (!status) {
            const newStatus = ChallengeStatus.create({
                user: user,
                challenge: challenge,
                status: ChallengeStatusEnum.PROCESSING,
            });
    
            newStatus.save();
        } else if (status.status !== ChallengeStatusEnum.PROCESSING) {
            status.status = ChallengeStatusEnum.PROCESSING;
            status.save();
        }

        

        

        const payload = {user: user, challenge: challenge, ...createSubmissionDto};

        const submission = ChallengeSubmission.create(payload);

        await submission.save();

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