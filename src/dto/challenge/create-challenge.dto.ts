import { Type } from "class-transformer";
import { IsDate, IsEnum, ValidateNested } from "class-validator";
import { ChallengeTranslation } from "src/entities/challenge-translation.entity";
import { ChallengeSubmissionTypeEnum } from "src/entities/enums/challenge-submission-type.enum";
import { ChallengeTypeEnum } from "src/entities/enums/challenge-type.enum";
import { ChallengeTranslationDto } from "./challenge-translation.dto";

export class CreateChallengeDto {
    @IsDate()
    expiredAt: Date;

    @IsEnum(ChallengeTypeEnum)
    type: ChallengeTypeEnum;

    @IsEnum(ChallengeSubmissionTypeEnum)
    submissionType: ChallengeSubmissionTypeEnum;

    @ValidateNested()
    @Type(() => ChallengeTranslationDto)
    translation: ChallengeTranslationDto[];
}