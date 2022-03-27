import { Injectable } from "@nestjs/common";
import { Challenge } from "src/entities/challenge.entity";
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


}